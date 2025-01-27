import type { Spectra, MiddlewareHandler } from "@spectrajs/core";
import type { OpenAPIDocument, OpenAPIOperation } from "./openapi";
import { toOpenAPIPath } from "./utils";

const schemaSymbol = Symbol("openapi");

export const addToDocs = (schema: OpenAPIOperation): MiddlewareHandler => {
  const mw: MiddlewareHandler = async (_, next) => {
    await next();
  };

  Object.assign(mw, { [schemaSymbol]: schema });
  return mw;
};

export type GenerateSpecsOptions = {
  documentation?: Partial<OpenAPIDocument>;
};

export const generateSpecs = (
  app: Spectra,
  opts?: GenerateSpecsOptions
): OpenAPIDocument => {
  const documentation = opts?.documentation;

  const schema: OpenAPIDocument["paths"] = {};

  for (const route of app.routes) {
    if (!(schemaSymbol in route.handler)) continue;

    const path = toOpenAPIPath(route.path);
    const method = route.method.toLowerCase();
    const docs = route.handler[schemaSymbol] as OpenAPIOperation;

    schema[path] = {
      ...(schema[path] ?? {}),
      [method]: docs,
    };
  }

  return {
    ...documentation,
    openapi: documentation?.openapi ?? "3.0.3",
    info: {
      title: "Spectra Documentation",
      version: "0.0.0",
      ...documentation?.info,
    },
    paths: schema,
  };
};
