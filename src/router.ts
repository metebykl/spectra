import { HTTPMethod } from "./types";

type RouterTree<Handler> = Record<"ALL" | HTTPMethod, Map<string, Handler>>;

export class Router<T> {
  private routes: RouterTree<T>;

  constructor() {
    this.routes = {
      ALL: new Map<string, T>(),
      GET: new Map<string, T>(),
      PUT: new Map<string, T>(),
      POST: new Map<string, T>(),
      DELETE: new Map<string, T>(),
      PATCH: new Map<string, T>(),
      HEAD: new Map<string, T>(),
      OPTIONS: new Map<string, T>(),
      TRACE: new Map<string, T>(),
      CONNECT: new Map<string, T>(),
    };
  }

  add(method: "ALL" | HTTPMethod, path: string, handler: T) {
    const existingRoute = this.routes[method].get(path);
    if (existingRoute) return;

    this.routes[method].set(path, handler);
  }

  match(method: HTTPMethod, path: string): T | null {
    const allHandler = this.routes["ALL"].get(path);
    if (allHandler) {
      return allHandler;
    }

    return this.routes[method].get(path) || null;
  }
}
