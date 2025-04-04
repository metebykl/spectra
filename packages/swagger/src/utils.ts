import type { OpenAPISpecsOptions } from ".";
import type { OpenAPIDocument, OpenAPIOperation } from "./openapi";

export const ALLOWED_METHODS = [
  "GET",
  "PUT",
  "POST",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
  "TRACE",
] as const;

export const toOpenAPIPath = (path: string): string => {
  return path
    .split("/")
    .map((p) => {
      let t = p;
      if (t.startsWith(":")) {
        t = `{${t.slice(1, t.length)}}`;
      }
      return t;
    })
    .join("/");
};

export const registerPath = ({
  path,
  method,
  data,
  schema,
}: {
  path: string;
  method: string;
  data: OpenAPIOperation;
  schema: OpenAPIDocument["paths"];
}): void => {
  path = toOpenAPIPath(path);
  method = method.toLowerCase();

  schema[path] = {
    ...(schema[path] ?? {}),
    [method]: data,
  };
};

export const filterPaths = (
  paths: OpenAPIDocument["paths"],
  { exclude = [] }: Pick<OpenAPISpecsOptions, "exclude">
): OpenAPIDocument["paths"] => {
  const filteredPaths: OpenAPIDocument["paths"] = {};

  for (const [path, schema] of Object.entries(paths)) {
    const matches = exclude.some((e) => {
      if (typeof e === "string") {
        return path === e;
      }

      return e.test(path);
    });

    if (matches || path.includes("*")) continue;

    // TODO: auto generate some route fields
    filteredPaths[path] = schema;
  }

  return filteredPaths;
};
