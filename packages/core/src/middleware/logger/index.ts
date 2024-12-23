import type { MiddlewareHandler } from "../../types";

type PrintFn = (str: string, ...rest: string[]) => void;

type LoggerOptions = {
  fn?: PrintFn;
  colorize?: boolean;
};

const getElapsed = (start: number, end: number): string => {
  const elapsed = end - start;
  return elapsed < 1000 ? `${elapsed}ms` : `${(elapsed / 1000).toFixed(2)}s`;
};

const colorizeStatus = (status: number): string => {
  switch ((status / 100) | 0) {
    case 5: // error = red
      return `\x1b[31m${status}\x1b[0m`;
    case 4: // warning = yellow
      return `\x1b[33m${status}\x1b[0m`;
    case 3: // redirect = cyan
      return `\x1b[36m${status}\x1b[0m`;
    case 2: // success = green
      return `\x1b[32m${status}\x1b[0m`;
  }

  return `${status}`;
};

const log = (
  fn: PrintFn,
  method: string,
  path: string,
  status: number,
  elapsed: string,
  colorize: boolean = true
) => {
  const str = colorize
    ? `${method} ${path} ${colorizeStatus(status)} ${elapsed}`
    : `${method} ${path} ${status} ${elapsed}`;
  fn(str);
};

export const logger = (options?: LoggerOptions): MiddlewareHandler => {
  return async function (c, next) {
    const method = c.method;
    const path = c.path;
    const fn = options?.fn ?? console.log;

    const start = Date.now();

    await next();

    const elapsed = getElapsed(start, Date.now());

    log(
      fn,
      method,
      path,
      c.res.status,
      elapsed.toString(),
      options?.colorize ?? true
    );
  };
};
