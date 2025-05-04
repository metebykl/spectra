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
  MergePath,
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

export interface SpectraOptions {
  router?: Router<H>;
}

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

  constructor(basePath?: BasePath, opts?: SpectraOptions) {
    this.#basePath = (basePath ?? "/") as BasePath;
    this.#router = opts?.router ?? new Router<H>();

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

  clone(): Spectra<BasePath> {
    const app = new Spectra(this.#basePath, {
      router: this.#router,
    });
    app.routes = this.routes;
    return app;
  }

  basePath<Path extends string>(
    path: Path
  ): Spectra<MergePath<BasePath, Path>> {
    const subApp = this.clone() as Spectra<MergePath<BasePath, Path>>;
    subApp.#basePath = mergePath(this.#basePath, path) as MergePath<
      BasePath,
      Path
    >;
    return subApp;
  }

  route<AppPath extends string, AppBasePath extends string>(
    path: AppPath,
    app: Spectra<AppBasePath>
  ): this {
    const subApp = this.basePath(path);
    app.routes.forEach((r) => {
      subApp.#addRoute(r.method as HTTPMethod, r.path, r.handler);
    });
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
      return (async () => {
        try {
          const res = await handler(c);
          return res;
        } catch (err) {
          if (err instanceof Error) {
            return this.#errorHandler(c, err);
          }
          throw err;
        }
      })();
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
    let response: Response;

    const dispatch = async (index: number) => {
      if (index < middleware.length) {
        const res = await middleware[index](context, () => dispatch(index + 1));
        if (res instanceof Response) {
          response = res;
        }
      } else {
        response = await handler(context);
      }

      if (response && context.finalized === false) {
        context.res = response;
      }
    };

    await dispatch(0);
    return context;
  }

  fetch = (request: Request): Response | Promise<Response> => {
    return this.#dispatch(request, request.method as HTTPMethod);
  };
}
