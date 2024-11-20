import type { Context } from "../../context";
import type { MiddlewareHandler } from "../../types";

export type TimeoutHandler = (c: Context) => Response;

const defaultTimeoutHandler: TimeoutHandler = (c) =>
  c.text("Gateway Timeout", 504);

type TimeoutOptions = {
  duration: number;
  handler?: TimeoutHandler;
};

export const timeout = (options: TimeoutOptions): MiddlewareHandler => {
  return async function (c, next) {
    const handler = options?.handler ?? defaultTimeoutHandler;

    let timer: number | undefined;

    const timeoutPromise = new Promise<void>((_, reject) => {
      timer = setTimeout(() => {
        reject(handler(c));
      }, options?.duration) as unknown as number;
    });

    try {
      await Promise.race([next(), timeoutPromise]);
    } catch (res) {
      if (res instanceof Response) {
        return res;
      }
    } finally {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    }
  };
};
