import type { MiddlewareHandler } from "../../types";

type PrintFn = (str: string, ...rest: string[]) => void;

type LoggerOptions = {
  fn?: PrintFn;
};

const log = (fn: PrintFn, method: string, path: string) => {
  const str = `${method} ${path}`;
  fn(str);
};

export const logger = (options?: LoggerOptions): MiddlewareHandler => {
  return async function (c, next) {
    const method = c.method;
    const path = c.path;

    const fn = options?.fn ?? console.log;
    log(fn, method, path);

    await next();
  };
};
