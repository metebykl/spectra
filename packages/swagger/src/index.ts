import type { MiddlewareHandler } from "@spectrajs/core";
import type { OpenAPIOperation } from "./openapi";

const schemaSymbol = Symbol("openapi");

export const addToDocs = (schema: OpenAPIOperation): MiddlewareHandler => {
  const mw: MiddlewareHandler = async (_, next) => {
    await next();
  };

  Object.defineProperty(mw, schemaSymbol, schema);
  return mw;
};
