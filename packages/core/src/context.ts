import { SpectraRequest } from "./request";
import { getPath } from "./utils/url";
import type { Handler, ParamKeys, ParamsToRecord } from "./types";
import type { OutgoingHttpHeaders } from "./utils/headers";

export type Data = string | ArrayBuffer | ReadableStream;

type ContextOptions = {
  notFoundHandler?: Handler;
};

type SetHeaderOptions = {
  append?: boolean;
};

export const TEXT_PLAIN = "text/plain; charset=UTF-8";

export class Context<P extends string = string> {
  path: P;
  method: string;
  req: SpectraRequest<P>;

  finalized: boolean = false;
  #status: number = 200;
  #headers: Headers;
  #res: Response | undefined;

  #store: Map<string, unknown>;
  #notFoundHandler: Handler | undefined;

  constructor(
    req: Request,
    params: ParamsToRecord<ParamKeys<P>>,
    options?: ContextOptions
  ) {
    this.path = getPath(req) as P;
    this.method = req.method;

    this.req = new SpectraRequest(req, params);
    this.#headers = new Headers();
    this.#store = new Map();

    if (options) {
      this.#notFoundHandler = options.notFoundHandler;
    }
  }

  header(
    name: OutgoingHttpHeaders | (string & {}),
    value: string | undefined,
    options?: SetHeaderOptions
  ): void {
    if (value === undefined) {
      this.#headers.delete(name);
      return;
    }

    if (options?.append) {
      this.#headers.append(name, value);
    } else {
      this.#headers.set(name, value);
    }
  }

  get<T>(key: string): T {
    return this.#store.get(key) as T;
  }

  set(key: string, value: unknown): void {
    this.#store.set(key, value);
  }

  status(code: number): void {
    this.#status = code;
  }

  get res(): Response {
    return (this.#res ??= new Response("404 Not Found", { status: 404 }));
  }

  set res(_res: Response) {
    if (this.#res) {
      // set existing headers
      for (const [key, value] of this.#res.headers.entries()) {
        // skip content type header
        if (key === "content-type") {
          continue;
        }

        _res.headers.set(key, value);
      }
    }

    this.#res = _res;
    this.finalized = true;
  }

  #newResponse(data: Data | null, status?: number): Response {
    return new Response(data, {
      status: status ?? this.#status,
      headers: this.#headers,
    });
  }

  json(data: unknown, status?: number): Response {
    const body = JSON.stringify(data);

    this.#headers.set("Content-Type", "application/json");
    return this.#newResponse(body, status);
  }

  text(data: string, status?: number): Response {
    this.#headers.set("Content-Type", TEXT_PLAIN);
    return this.#newResponse(data, status);
  }

  html(data: string, status?: number): Response {
    this.#headers.set("Content-Type", "text/html");
    return this.#newResponse(data, status);
  }

  body(data: Data | null, status?: number): Response {
    return this.#newResponse(data, status);
  }

  redirect(location: string, status?: number): Response {
    this.#headers.set("Location", location);
    return this.#newResponse(null, status ?? 302);
  }

  notFound(): Response | Promise<Response> {
    if (!this.#notFoundHandler) {
      return new Response();
    }
    return this.#notFoundHandler(this);
  }
}
