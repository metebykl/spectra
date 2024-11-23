import type { HTTPMethod } from "./types";

type RouterTree<T> = Record<"ALL" | HTTPMethod, RouteMap<T>>;

type RouteMap<T> = {
  static: [string, T][];
  dynamic: RoutePattern<T>[];
};

type RoutePattern<T> = {
  regex: RegExp;
  paramNames: string[];
  handler: T;
};

export type Params = Record<string, string>;

export type MatchResult<T> = [T, Params][];

export class Router<T> {
  #routes: RouterTree<T>;

  constructor() {
    this.#routes = {
      ALL: { static: [], dynamic: [] },
      GET: { static: [], dynamic: [] },
      PUT: { static: [], dynamic: [] },
      POST: { static: [], dynamic: [] },
      DELETE: { static: [], dynamic: [] },
      PATCH: { static: [], dynamic: [] },
      HEAD: { static: [], dynamic: [] },
      OPTIONS: { static: [], dynamic: [] },
      TRACE: { static: [], dynamic: [] },
      CONNECT: { static: [], dynamic: [] },
    };
  }

  add(method: "ALL" | HTTPMethod, path: string, handler: T) {
    if (path.includes(":") || path.includes("*")) {
      const { regex, paramNames } = this.#createRouteRegex(path);
      const routePattern: RoutePattern<T> = { regex, paramNames, handler };
      this.#routes[method].dynamic.push(routePattern);
    } else {
      this.#routes[method].static.push([path, handler]);
    }
  }

  match(method: HTTPMethod, path: string): MatchResult<T> {
    path = path.split("?")[0];

    const dynamicRoutes = [
      ...this.#routes["ALL"].dynamic,
      ...this.#routes[method].dynamic,
    ];

    let handlers: MatchResult<T> = [];

    for (const route of dynamicRoutes) {
      const match = route.regex.exec(path);
      if (match) {
        const params = this.#extractParams(match, route.paramNames);
        handlers.push([route.handler, params]);
      }
    }

    const staticRoutes = [
      ...this.#routes["ALL"].static.filter(([p, _]) => p === path),
      ...this.#routes[method].static.filter(([p, _]) => p === path),
    ];

    for (const [_, handler] of staticRoutes) {
      handlers.push([handler, {}]);
    }

    return handlers;
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
