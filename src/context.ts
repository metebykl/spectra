import { SpectraRequest } from "./request";
import { getPath } from "./utils/url";
import type { Handler, ParamKeys, ParamsToRecord } from "./types";
import type { OutgoingHttpHeaders } from "./utils/headers";

export type Data = string | ArrayBuffer | ReadableStream;

type ContextOptions = {
  notFoundHandler?: Handler;
};

export class Context<P extends string = string> {
  path: P;
  method: string;
  req: SpectraRequest<P>;

  #status: number = 200;
  #headers: Headers;
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
    value: string | undefined
  ): void {
    if (value === undefined) {
      this.#headers.delete(name);
      return;
    }

    this.#headers.set(name, value);
  }

  #newResponse(data: Data | null, status?: number): Response {
    return new Response(data, {
      status: status ?? this.#status,
      headers: this.#headers,
    });
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

  json(data: unknown, status?: number): Response {
    const body = JSON.stringify(data);

    this.#headers.set("Content-Type", "application/json");
    return this.#newResponse(body, status);
  }

  text(data: string, status?: number): Response {
    this.#headers.set("Content-Type", "text/plain");
    return this.#newResponse(data, status);
  }

  html(data: string, status?: number): Response {
    this.#headers.set("Content-Type", "text/html");
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
