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
  exclude: string[]
): OpenAPIDocument["paths"] => {
  const filteredPaths: OpenAPIDocument["paths"] = {};

  for (const [path, schema] of Object.entries(paths)) {
    // TODO: implement regex matchers
    if (exclude.includes(path)) continue;

    // TODO: auto generate some route fields
    filteredPaths[path] = schema;
  }

  return filteredPaths;
};
