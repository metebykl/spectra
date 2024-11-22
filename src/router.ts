import type { HTTPMethod } from "./types";

type RouterTree<T> = Record<"ALL" | HTTPMethod, RouteMap<T>>;

type RouteMap<Handler> = {
  static: Map<string, Handler>;
  dynamic: RoutePattern<Handler>[];
};

type RoutePattern<Handler> = {
  regex: RegExp;
  paramNames: string[];
  handler: Handler;
};

export type Params = Record<string, string>;

export type MatchResult<T> = [T, Params];

export class Router<T> {
  #routes: RouterTree<T>;

  constructor() {
    this.#routes = {
      ALL: { static: new Map(), dynamic: [] },
      GET: { static: new Map(), dynamic: [] },
      PUT: { static: new Map(), dynamic: [] },
      POST: { static: new Map(), dynamic: [] },
      DELETE: { static: new Map(), dynamic: [] },
      PATCH: { static: new Map(), dynamic: [] },
      HEAD: { static: new Map(), dynamic: [] },
      OPTIONS: { static: new Map(), dynamic: [] },
      TRACE: { static: new Map(), dynamic: [] },
      CONNECT: { static: new Map(), dynamic: [] },
    };
  }

  add(method: "ALL" | HTTPMethod, path: string, handler: T) {
    if (path.includes(":") || path.includes("*")) {
      const { regex, paramNames } = this.#createRouteRegex(path);
      const routePattern: RoutePattern<T> = { regex, paramNames, handler };
      this.#routes[method].dynamic.push(routePattern);
    } else {
      this.#routes[method].static.set(path, handler);
    }
  }

  match(method: HTTPMethod, path: string): MatchResult<T> | null {
    path = path.split("?")[0];

    const staticHandler =
      this.#routes["ALL"].static.get(path) ||
      this.#routes[method].static.get(path);

    if (staticHandler) {
      return [staticHandler, {}];
    }

    const paramRoutes = [
      ...this.#routes["ALL"].dynamic,
      ...this.#routes[method].dynamic,
    ];

    for (const route of paramRoutes) {
      const match = route.regex.exec(path);
      if (match) {
        const params = this.#extractParams(match, route.paramNames);
        return [route.handler, params];
      }
    }

    return null;
  }

  #createRouteRegex(path: string): {
    regex: RegExp;
    paramNames: string[];
  } {
    const paramNames: string[] = [];
    const regexPath = path
      .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      })
      .replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPath}$`);
    return { regex, paramNames };
  }

  #extractParams(
    match: RegExpExecArray,
    paramNames: string[]
  ): Record<string, string> {
    const params: Record<string, string> = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });
    return params;
  }
}
