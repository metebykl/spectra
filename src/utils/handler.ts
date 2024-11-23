import { H, MiddlewareHandler } from "../types";

export const isMiddleware = (handler: H): handler is MiddlewareHandler => {
  return handler.length === 2;
};
