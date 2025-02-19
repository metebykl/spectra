import type { Spectra, MiddlewareHandler } from "@spectrajs/core";
import type { OpenAPIDocument, OpenAPIOperation } from "./openapi";
import type { SwaggerUIConfigOptions } from "./swagger";
import {
  ALLOWED_METHODS,
  filterPaths,
  registerPath,
  toOpenAPIPath,
} from "./utils";

const schemaSymbol = Symbol("openapi");

export const describeRoute = (schema: OpenAPIOperation): MiddlewareHandler => {
  const mw: MiddlewareHandler = async (_, next) => {
    await next();
  };

  Object.assign(mw, { [schemaSymbol]: schema });
  return mw;
};

export type OpenAPISpecsOptions = {
  documentation?: Partial<OpenAPIDocument>;
  exclude?: string[];
  excludeMethods?: (typeof ALLOWED_METHODS)[number][];
  excludeTags?: string[];
};

export const openAPISpecs = (
  app: Spectra,
  opts?: OpenAPISpecsOptions
): MiddlewareHandler => {
  let specs: OpenAPIDocument | null = null;
  return async function (c) {
    if (specs) return c.json(specs);
    specs = await generateSpecs(app, opts);
    return c.json(specs);
  };
};

export const generateSpecs = (
  app: Spectra,
  opts?: OpenAPISpecsOptions
): OpenAPIDocument => {
  const documentation = opts?.documentation;
  const exclude = opts?.exclude ?? [];
  const excludeMethods: string[] = opts?.excludeMethods ?? ["OPTIONS"];
  const excludeTags = opts?.excludeTags ?? [];

  const schema: OpenAPIDocument["paths"] = {};

  for (const route of app.routes) {
    if (!(schemaSymbol in route.handler)) continue;

    if (
      (ALLOWED_METHODS as readonly string[]).includes(route.method) === false &&
      route.method !== "ALL"
    )
      continue;

    if (excludeMethods.includes(route.method)) continue;

    const path = toOpenAPIPath(route.path);
    const method = route.method.toLowerCase();
    const docs = route.handler[schemaSymbol] as OpenAPIOperation;

    registerPath({ path, method, data: docs, schema });
  }

  return {
    openapi: documentation?.openapi ?? "3.0.3",
    ...{
      ...documentation,
      tags: documentation?.tags?.filter(
        (tag) => !excludeTags.includes(tag.name)
      ),
      info: {
        title: "Spectra Documentation",
        version: "0.0.0",
        ...documentation?.info,
      },
      paths: {
        ...filterPaths(schema, exclude),
        ...documentation?.paths,
      },
    },
  };
};

export type SwaggerUIOptions = Omit<
  Partial<SwaggerUIConfigOptions>,
  "dom_id" | "dom_node" | "url" | "urls" | "spec"
> & {
  url: string;
  title?: string;
  version?: string;
};

export const swaggerUI = (options: SwaggerUIOptions): MiddlewareHandler => {
  const title = options.title ?? "SwaggerUI";
  const version = options.version ?? "5.18.2";

  const swaggerUIOptions = {
    dom_id: "#swagger-ui",
    ...options,
  };
  const transformedSwaggerUIOptions = JSON.stringify(swaggerUIOptions);

  return async function (c) {
    return c.html(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${title}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${version}/swagger-ui.css" />
        </head>
        <body>
          <div>
            <div id="swagger-ui"></div>
            <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@${version}/swagger-ui-bundle.js" crossorigin="anonymous"></script>
            <script>
              window.onload = () => {
                window.ui = SwaggerUIBundle(${transformedSwaggerUIOptions});
              };
            </script>
          </div>
        </body>
      </html>
      `);
  };
};
