import type { Context } from "./context";
import type { MiddlewareHandler } from "./types";
import type { RequestHeader } from "./utils/headers";

export type ValidationTargets = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any;
  form: FormData;
  query: Record<string, string | string[]>;
  params: Record<string, string>;
  headers: Record<RequestHeader | (string & {}), string>;
};

export type ValidationFunction<I, O> = (
  value: I,
  c: Context
) => O | Response | Promise<O> | Promise<Response>;

export const validator = <U extends keyof ValidationTargets, O>(
  target: U,
  validationFn: ValidationFunction<ValidationTargets[U], O>
): MiddlewareHandler => {
  return async function (c, next) {
    let value;

    // TODO: check content-type for json and form targets
    switch (target) {
      case "json":
        try {
          value = await c.req.json();
        } catch {
          return c.text("Bad Request", 400);
        }
        break;
      case "form":
        try {
          value = await c.req.formData();
        } catch {
          return c.text("Bad Request", 400);
        }
        break;
      case "query":
        value = c.req.queries();
        break;
      case "params":
        value = c.req.params();
        break;
      case "headers":
        value = c.req.header();
        break;
    }

    const res = await validationFn(value, c);
    if (res instanceof Response) {
      return res;
    }

    c.set("valid", res);
    await next();
  };
};
