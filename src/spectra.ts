import { Context } from "./context";
import { Router } from "./router";
import { getPath } from "./utils/url";
import type { Handler, HTTPMethod, MiddlewareHandler } from "./types";

const notFoundHandler = (c: Context) => {
  return c.text("404 Not Found", 404);
};

export class Spectra<BasePath extends string = "/"> {
  private _basePath: BasePath;
  private router: Router<Handler<any>>;

  private middlewares: MiddlewareHandler<any>[] = [];
  private notFoundHandler: Handler = notFoundHandler;

  constructor(basePath?: BasePath) {
    this._basePath = (basePath ?? "/") as BasePath;
    this.router = new Router<Handler<any>>();
  }

  use(middleware: MiddlewareHandler<"*">): this {
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

  private dispatch(
    request: Request,
    method: HTTPMethod
  ): Response | Promise<Response> {
    const path = getPath(request);

    const match = this.router.match(method, path);
    if (!match) {
      const c = new Context(request, path, {});
      return this.notFoundHandler(c);
    }

    const c = new Context(request, path, match.params);

    const handlerWithMiddlewares = async (context: Context) => {
      return await this.executeMiddlewares(
        context,
        this.middlewares,
        match.handler
      );
    };

    return handlerWithMiddlewares(c);
  }

  private async executeMiddlewares(
    context: Context<any>,
    middlewares: MiddlewareHandler[],
    handler: Handler<any>
  ): Promise<Response> {
    let index = -1;

    let response: Response;

    const next = async () => {
      index++;
      if (index < middlewares.length) {
        await middlewares[index](context, next);
      } else {
        response = await handler(context);
      }
    };

    await next();
    return response!;
  }

  fetch(request: Request): Response | Promise<Response> {
    return this.dispatch(request, request.method as HTTPMethod);
  }
}
