/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "./context";
import { HTTP_METHODS, type Params, Router } from "./router";
import { isMiddleware } from "./utils/handler";
import { getNonStrictPath, mergePath } from "./utils/url";
import type {
  ErrorHandler,
  H,
  Handler,
  HTTPMethod,
  MiddlewareHandler,
  RouteInterface,
  RouterNode,
} from "./types";

const notFoundHandler = (c: Context) => {
  return c.text("404 Not Found", 404);
};

const errorHandler = (c: Context, err: Error) => {
  console.error(err);
  return c.text("Internal Server Error", 500);
};

export class Spectra<BasePath extends string = "/"> {
  all!: RouteInterface<BasePath>;
  get!: RouteInterface<BasePath>;
  put!: RouteInterface<BasePath>;
  post!: RouteInterface<BasePath>;
  delete!: RouteInterface<BasePath>;
  patch!: RouteInterface<BasePath>;
  head!: RouteInterface<BasePath>;
  options!: RouteInterface<BasePath>;
  trace!: RouteInterface<BasePath>;
  connect!: RouteInterface<BasePath>;

  #basePath: BasePath;
  #router: Router<H>;
  routes: RouterNode[] = [];

  #notFoundHandler: Handler = notFoundHandler;
  #errorHandler: ErrorHandler = errorHandler;

  constructor(basePath?: BasePath) {
    this.#basePath = (basePath ?? "/") as BasePath;
    this.#router = new Router<H>();

    // app.get(path, ...handlers[])
    const methods = [...HTTP_METHODS, "all"] as const;
    methods.forEach((method) => {
      this[method] = (path: string, ...args: H[]) => {
        args.forEach((handler) => {
          this.#addRoute(method.toUpperCase() as HTTPMethod, path, handler);
        });
        return this as any;
      };
    });
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

  notFound(handler: Handler): this {
    this.#notFoundHandler = handler;
    return this;
  }

  onError(handler: ErrorHandler): this {
    this.#errorHandler = handler;
    return this;
  }

  #addRoute(method: "ALL" | HTTPMethod, path: string, handler: H) {
    path = mergePath(this.#basePath, path);
    this.#router.add(method, path, handler);
    this.routes.push({ path, method, handler });
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
        try {
          const context = await this.#compose(c, stack, async () => {
            return this.#notFoundHandler(c);
          });
          return context.res;
        } catch (err) {
          if (err instanceof Error) {
            return this.#errorHandler(c, err);
          }
          throw err;
        }
      })();
    }

    if (stack.length === 0) {
      try {
        const res = handler(c);
        return res;
      } catch (err) {
        if (err instanceof Error) {
          return this.#errorHandler(c, err);
        }
        throw err;
      }
    }

    return (async () => {
      try {
        const context = await this.#compose(c, stack, handler);
        return context.res;
      } catch (err) {
        if (err instanceof Error) {
          return this.#errorHandler(c, err);
        }
        throw err;
      }
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
