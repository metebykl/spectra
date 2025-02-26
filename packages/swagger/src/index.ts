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

export type SwaggerEditorOptions = Omit<
  Partial<SwaggerUIConfigOptions>,
  "dom_id" | "dom_node" | "url" | "urls" | "spec" | "presets" | "layout"
> & {
  title?: string;
  version?: string;
};

export const swaggerEditor = (
  options: SwaggerEditorOptions = {}
): MiddlewareHandler => {
  const title = options.title ?? "Swagger Editor";
  const version = options.version ?? "4.14.3";

  const editorOptions = {
    dom_id: "#swagger-editor",
    layout: "StandaloneLayout",
    ...options,
  } satisfies SwaggerUIConfigOptions;

  const transformedEditorOptions = Object.entries(editorOptions)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}: '${value}'`;
      }
      if (Array.isArray(value)) {
        return `${key}: ${value.map((v) => `${v}`).join(",")}`;
      }
      if (typeof value === "object") {
        return `${key}: ${JSON.stringify(value)}`;
      }

      return `${key}: ${value}`;
    })
    .join(",");

  return async function (c) {
    return c.html(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${title}</title>
          <style>
            ${NORMALIZE_CSS}
          </style>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-editor-dist@${version}/swagger-editor.css" />
        </head>
        <body>
          <div id="swagger-editor"></div>
          <script src="https://cdn.jsdelivr.net/npm/swagger-editor-dist@${version}/swagger-editor-bundle.js" crossorigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/swagger-editor-dist@${version}/swagger-editor-standalone-preset.js" crossorigin="anonymous"></script>
          <script>
            window.onload = () => {
              window.ui = SwaggerEditorBundle({
                ${transformedEditorOptions},
                presets: [
                  SwaggerEditorStandalonePreset
                ]
              });
            };
          </script>
        </body>
      </html>
      `);
  };
};

const NORMALIZE_CSS = `
/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

.Pane2 {
  overflow-y: scroll;
}

html {
  font-family:
    system-ui, 
    sans-serif, 
    "Apple Color Emoji", 
    "Segoe UI Emoji", 
    "Segoe UI Symbol", 
    "Noto Color Emoji";
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

body {
  margin: 0;
}

main {
  display: block;
}

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

a {
  background-color: transparent;
}

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

b,
strong {
  font-weight: bolder;
}

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

small {
  font-size: 80%;
}

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

img {
  border-style: none;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

button,
input { /* 1 */
  overflow: visible;
}

button,
select { /* 1 */
  text-transform: none;
}

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

progress {
  vertical-align: baseline;
}

textarea {
  overflow: auto;
}

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

details {
  display: block;
}

summary {
  display: list-item;
}

template {
  display: none;
}

[hidden] {
  display: none;
}
`;
