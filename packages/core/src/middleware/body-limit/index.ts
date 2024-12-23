import type { Context } from "../../context";
import type { MiddlewareHandler } from "../../types";

export type BodyLimitErrorHandler = (
  c: Context
) => Response | Promise<Response>;

const ERROR_MESSAGE = "Content Too Large";

const defaultErrorHandler: BodyLimitErrorHandler = (c: Context) => {
  return c.text(ERROR_MESSAGE, 413);
};

type BodyLimitOptions = {
  maxSize: number;
  onError?: BodyLimitErrorHandler;
};

class BodyLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BodyLimitError";
  }
}

export const bodyLimit = (options: BodyLimitOptions): MiddlewareHandler => {
  const maxSize = options.maxSize;
  const onError = options.onError || defaultErrorHandler;

  return async function (c, next) {
    if (!c.req.raw.body) {
      return next();
    }

    if (c.req.header("content-length")) {
      const contentLength = parseInt(c.req.header("content-length") || "0", 10);
      return contentLength > maxSize ? onError(c) : next();
    }

    let total = 0;

    const rawReader = c.req.raw.body.getReader();
    const reader = new ReadableStream({
      async start(controller) {
        try {
          for (;;) {
            const { done, value } = await rawReader.read();
            if (done) {
              break;
            }

            total += value.length;
            if (total > maxSize) {
              controller.error(new BodyLimitError(ERROR_MESSAGE));
              break;
            }

            controller.enqueue(value);
          }
        } finally {
          controller.close();
        }
      },
    });

    const init: RequestInit & { duplex: "half" } = {
      body: reader,
      duplex: "half",
    };
    c.req.raw = new Request(c.req.raw, init);

    try {
      await next();
    } catch (error) {
      if (error instanceof BodyLimitError) {
        c.res = await onError(c);
        return;
      }

      throw error;
    }
  };
};
