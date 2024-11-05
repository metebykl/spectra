import { Context } from "./context";
import { Router, type RouteMatch } from "./router";
import type { Handler, HTTPMethod, Middleware } from "./types";

const notFoundHandler = (c: Context) => {
  return c.text("404 Not Found", 404);
};

export class Spectra<BasePath extends string = "/"> {
  private _basePath: BasePath;
  private router: Router<Handler<any>>;

  private middlewares: Middleware<any>[] = [];
  private notFoundHandler: Handler = notFoundHandler;

  constructor(basePath?: BasePath) {
    this._basePath = (basePath ?? "/") as BasePath;
    this.router = new Router<Handler<any>>();
  }

  use(middleware: Middleware<"*">): this {
    this.middlewares.push(middleware);
    return this;
  }

  all<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("ALL", path, handler);
    return this;
  }

  get<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("GET", path, handler);
    return this;
  }

  put<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("PUT", path, handler);
    return this;
  }

  post<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("POST", path, handler);
    return this;
  }

  delete<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("DELETE", path, handler);
    return this;
  }

  patch<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("PATCH", path, handler);
    return this;
  }

  head<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("HEAD", path, handler);
    return this;
  }

  options<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("OPTIONS", path, handler);
    return this;
  }

  trace<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("TRACE", path, handler);
    return this;
  }

  connect<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("CONNECT", path, handler);
    return this;
  }

  notFound(handler: Handler): this {
    this.notFoundHandler = handler;
    return this;
  }

  match<Path extends string>(
    method: HTTPMethod,
    path: Path
  ): RouteMatch<Handler<Path>> | RouteMatch<Handler> {
    const match = this.router.match(method, path);
    if (!match) {
      return { handler: this.notFoundHandler, params: {} };
    }

    const handlerWithMiddlewares = async (context: Context<Path>) => {
      await this.executeMiddlewares(context, this.middlewares, match.handler);
    };

    return { handler: handlerWithMiddlewares, params: match.params };
  }

  private async executeMiddlewares(
    context: Context<any>,
    middlewares: Middleware[],
    handler: Handler<any>
  ): Promise<void> {
    let index = -1;

    const next = async () => {
      index++;
      if (index < middlewares.length) {
        await middlewares[index](context, next);
      } else {
        handler(context);
      }
    };

    await next();
  }
}
