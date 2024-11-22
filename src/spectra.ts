import { Context } from "./context";
import { Router } from "./router";
import { getNonStrictPath, mergePath } from "./utils/url";
import type { Handler, HTTPMethod, MiddlewareHandler } from "./types";

const notFoundHandler = (c: Context) => {
  return c.text("404 Not Found", 404);
};

export class Spectra<BasePath extends string = "/"> {
  #basePath: BasePath;
  #router: Router<Handler>;

  #middlewares: MiddlewareHandler<any>[] = [];
  #notFoundHandler: Handler = notFoundHandler;

  constructor(basePath?: BasePath) {
    this.#basePath = (basePath ?? "/") as BasePath;
    this.#router = new Router<Handler>();
  }

  use(middleware: MiddlewareHandler<"*">): this {
    this.#middlewares.push(middleware);
    return this;
  }

  all<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("ALL", path, handler);
    return this;
  }

  get<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("GET", path, handler);
    return this;
  }

  put<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("PUT", path, handler);
    return this;
  }

  post<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("POST", path, handler);
    return this;
  }

  delete<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("DELETE", path, handler);
    return this;
  }

  patch<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("PATCH", path, handler);
    return this;
  }

  head<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("HEAD", path, handler);
    return this;
  }

  options<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("OPTIONS", path, handler);
    return this;
  }

  trace<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("TRACE", path, handler);
    return this;
  }

  connect<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.#addRoute("CONNECT", path, handler);
    return this;
  }

  notFound(handler: Handler): this {
    this.#notFoundHandler = handler;
    return this;
  }

  #addRoute(method: "ALL" | HTTPMethod, path: string, handler: Handler) {
    path = mergePath(this.#basePath, path);
    this.#router.add(method, path, handler);
  }

  #dispatch(
    request: Request,
    method: HTTPMethod
  ): Response | Promise<Response> {
    const path = getNonStrictPath(request);

    const match = this.#router.match(method, path);
    if (!match) {
      const c = new Context(request, {});
      return this.#notFoundHandler(c);
    }

    const c = new Context(request, match[1], {
      notFoundHandler: this.#notFoundHandler,
    });

    return (async () => {
      const context = await this.#compose(c, this.#middlewares, match[0]);
      return context.res;
    })();
  }

  async #compose(
    context: Context<any>,
    middlewares: MiddlewareHandler[],
    handler: Handler<any>
  ): Promise<Context> {
    let index = -1;

    const next = async () => {
      index++;

      let response: Response;

      if (index < middlewares.length) {
        // middleware found, run the middleware
        const res = await middlewares[index](context, next);
        if (res instanceof Response) {
          response = res;
        }
      } else {
        // no middleware found, run the handler
        response = await handler(context);
      }

      if (response! && context.finalized === false) {
        context.res = response;
      }
    };

    await next();
    return context;
  }

  fetch = (request: Request): Response | Promise<Response> => {
    return this.#dispatch(request, request.method as HTTPMethod);
  };
}
