import type { Context } from "./context";
import type { MiddlewareHandler, ValidationTargets } from "./types";

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

    switch (target) {
      case "json":
        try {
          value = await c.req.json();
        } catch {
          return c.text("Bad Request", 400);
        }
        break;
      case "form": {
        let formData: FormData;
        try {
          formData = await c.req.formData();
        } catch {
          return c.text("Bad Request", 400);
        }

        const result: Record<string, string | File | (string | File)[]> = {};
        formData.forEach((v, k) => {
          if (k in result) {
            if (Array.isArray(result[k])) {
              (result[k] as (string | File)[]).push(v);
            } else {
              result[k] = [result[k] as string | File, v];
            }
          } else {
            result[k] = v;
          }
        });

        value = result;
        break;
      }
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

    c.req.setValidData(target, res);
    await next();
  };
};
