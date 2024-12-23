import type { MiddlewareHandler } from "../../types";

type PoweredByOptions = {
  serverName: string;
};

export const poweredBy = (options?: PoweredByOptions): MiddlewareHandler => {
  return async function (c, next) {
    c.header("X-Powered-By", options?.serverName ?? "Spectra");
    await next();
  };
};
