import type { AnyRouter } from "@trpc/server";
import type {
  FetchCreateContextFnOptions,
  FetchHandlerRequestOptions,
} from "@trpc/server/adapters/fetch";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { Context, MiddlewareHandler, StatusCode } from "@spectrajs/core";

type tRPCOptions = Omit<
  FetchHandlerRequestOptions<AnyRouter>,
  "req" | "createContext" | "endpoint"
> & {
  endpoint?: string;
  createContext?: (
    c: Context,
    opts: FetchCreateContextFnOptions
  ) => Record<string, unknown> | Promise<Record<string, unknown>>;
};

export const trpc = ({
  endpoint = "/trpc",
  createContext,
  ...options
}: tRPCOptions): MiddlewareHandler => {
  return async function (c) {
    const res = await fetchRequestHandler({
      ...options,
      createContext: async (opts) =>
        createContext ? await createContext(c, opts) : {},
      endpoint,
      req: c.req.raw,
    });

    res.headers.forEach((v, k) => {
      if (k === "set-cookie") {
        c.header(k, v, { append: true });
      } else {
        c.header(k, v);
      }
    });
    c.body(res.body, res.status as StatusCode);

    return res;
  };
};
