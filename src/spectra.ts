/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "./context";
import { type Params, Router } from "./router";
import { isMiddleware } from "./utils/handler";
import { getNonStrictPath, mergePath } from "./utils/url";
import type { H, Handler, HTTPMethod, MiddlewareHandler } from "./types";

const notFoundHandler = (c: Context) => {
  return c.text("404 Not Found", 404);
};

export class Spectra<BasePath extends string = "/"> {
  #basePath: BasePath;
  #router: Router<H>;

  #notFoundHandler: Handler = notFoundHandler;

  constructor(basePath?: BasePath) {
    this.#basePath = (basePath ?? "/") as BasePath;
    this.#router = new Router<H>();
  }

  use(
    arg: string | MiddlewareHandler<any>,
    ...args: MiddlewareHandler<any>[]
  ): this {
    let path;

    if (typeof arg === "string") {
      path = arg;
    } else {
      path = "*";
      args.unshift(arg);
    }

    for (const handler of args) {
      this.#addRoute("ALL", path, handler);
    }

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

  #addRoute(method: "ALL" | HTTPMethod, path: string, handler: H) {
    path = mergePath(this.#basePath, path);
    this.#router.add(method, path, handler);
  }

  #dispatch(
    request: Request,
    method: HTTPMethod
  ): Response | Promise<Response> {
    const path = getNonStrictPath(request);

    const matches = this.#router.match(method, path);
    if (matches.length === 0) {
      const c = new Context(request, {});
      return this.#notFoundHandler(c);
    }

    const [handler, params] = matches.pop() as [Handler, Params];
    const stack = matches.map((m) => m[0]).filter(isMiddleware);

    const c = new Context(request, params, {
      notFoundHandler: this.#notFoundHandler,
    });

    if (isMiddleware(handler)) {
      stack.push(handler);

      return (async () => {
        const context = await this.#compose(c, stack, async () => {
          return this.#notFoundHandler(c);
        });
        return context.res;
      })();
    }

    if (stack.length === 0) {
      return handler(c);
    }

    return (async () => {
      const context = await this.#compose(c, stack, handler);
      return context.res;
    })();
  }

  async #compose(
    context: Context<any>,
    middleware: MiddlewareHandler[],
    handler: Handler<any>
  ): Promise<Context> {
    let index = -1;

    const next = async () => {
      index++;

      let response: Response;

      if (index < middleware.length) {
        const handler = await middleware[index];
        const res = await handler(context, next);
        if (res instanceof Response) {
          response = res;
        }
      } else {
        response = await handler(context);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
