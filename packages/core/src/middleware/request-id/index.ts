import type { Context } from "../../context";
import type { MiddlewareHandler } from "../../types";

interface RequestIdOptions {
  headerName?: string;
  generator?: (c: Context) => string;
}

export const requestId = ({
  headerName = "X-Request-Id",
  generator = () => crypto.randomUUID(),
}: RequestIdOptions = {}): MiddlewareHandler => {
  return async function (c, next) {
    let id = c.req.header(headerName);
    if (!id) {
      id = generator(c);
    }

    c.set("requestId", id);
    if (headerName) {
      c.header(headerName, id);
    }

    await next();
  };
};
