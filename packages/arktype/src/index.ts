import type { MiddlewareHandler, ValidationTargets } from "@spectrajs/core";
import { validator } from "@spectrajs/core/validator";
import { type, type Type } from "arktype";

export const arktypeValidator = <
  U extends keyof ValidationTargets,
  Z extends Type,
>(
  target: U,
  schema: Z
): MiddlewareHandler => {
  return validator(target, async (value, c) => {
    let data = value;

    if (target === "headers") {
      const keys = Object.keys(schema);
      const keyMap = new Map(keys.map((k) => [k.toLowerCase(), k]));

      data = Object.fromEntries(
        Object.entries(value).map(([k, v]) => [
          keyMap.get(k.toLowerCase()) || k,
          v,
        ])
      );
    }

    const out = schema(data);
    if (out instanceof type.errors) {
      return c.json({ success: false, error: out }, 400);
    }

    return out;
  });
};
