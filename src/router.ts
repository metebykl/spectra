import { HTTPMethod } from "./types";

type RouterTree<T> = Record<"ALL" | HTTPMethod, RouteMap<T>>;

type RoutePattern<Handler> = {
  regex: RegExp;
  paramNames: string[];
  handler: Handler;
};

type RouteMap<Handler> = {
  staticRoutes: Map<string, Handler>;
  paramRoutes: RoutePattern<Handler>[];
};

export type RouteMatch<Handler> = {
  params: Record<string, string>;
  handler: Handler;
};

export class Router<T> {
  private routes: RouterTree<T>;

  constructor() {
    this.routes = {
      ALL: { staticRoutes: new Map(), paramRoutes: [] },
      GET: { staticRoutes: new Map(), paramRoutes: [] },
      PUT: { staticRoutes: new Map(), paramRoutes: [] },
      POST: { staticRoutes: new Map(), paramRoutes: [] },
      DELETE: { staticRoutes: new Map(), paramRoutes: [] },
      PATCH: { staticRoutes: new Map(), paramRoutes: [] },
      HEAD: { staticRoutes: new Map(), paramRoutes: [] },
      OPTIONS: { staticRoutes: new Map(), paramRoutes: [] },
      TRACE: { staticRoutes: new Map(), paramRoutes: [] },
      CONNECT: { staticRoutes: new Map(), paramRoutes: [] },
    };
  }

  add(method: "ALL" | HTTPMethod, path: string, handler: T) {
    if (path.includes(":")) {
      const { regex, paramNames } = this.createRouteRegex(path);
      const routePattern: RoutePattern<T> = { regex, paramNames, handler };
      this.routes[method].paramRoutes.push(routePattern);
    } else {
      this.routes[method].staticRoutes.set(path, handler);
    }
  }

  match(method: HTTPMethod, path: string): RouteMatch<T> | null {
    const staticHandler =
      this.routes["ALL"].staticRoutes.get(path) ||
      this.routes[method].staticRoutes.get(path);

    if (staticHandler) {
      return { params: {}, handler: staticHandler };
    }

    const paramRoutes = [
      ...this.routes["ALL"].paramRoutes,
      ...this.routes[method].paramRoutes,
    ];

    for (const route of paramRoutes) {
      const match = route.regex.exec(path);
      if (match) {
        const params = this.extractParams(match, route.paramNames);
        return { params, handler: route.handler };
      }
    }

    return null;
  }

  private createRouteRegex(path: string): {
    regex: RegExp;
    paramNames: string[];
  } {
    const paramNames: string[] = [];
    const regexPath = path.replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });
    const regex = new RegExp(`^${regexPath}$`);
    return { regex, paramNames };
  }

  private extractParams(
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
