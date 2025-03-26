import type { MiddlewareHandler } from "@spectrajs/core";
import { validator, type ValidationTargets } from "@spectrajs/core/validator";
import { ZodObject, type ZodSchema } from "zod";

export const zodValidator = <
  U extends keyof ValidationTargets,
  Z extends ZodSchema,
>(
  target: U,
  schema: Z
): MiddlewareHandler => {
  return validator(target, async (value, c) => {
    let data = value;

    if (target === "headers" && schema instanceof ZodObject) {
      const keys = Object.keys(schema.shape);
      const keyMap = new Map(keys.map((k) => [k.toLowerCase(), k]));

      data = Object.fromEntries(
        Object.entries(value).map(([k, v]) => [
          keyMap.get(k.toLowerCase()) || k,
          v,
        ])
      );
    }

    const result = await schema.safeParseAsync(data);
    if (!result.success) {
      return c.json(result, 400);
    }

    return result.data;
  });
};
