import { SpectraRequest } from "./request";
import { getPath } from "./utils/url";
import type { ParamKeys, ParamsToRecord } from "./types";
import type { OutgoingHttpHeaders } from "./utils/headers";

export type Data = string | ArrayBuffer | ReadableStream;

export class Context<P extends string = string> {
  path: P;
  method: string;
  req: SpectraRequest<P>;

  #status: number = 200;
  #headers: Headers;
  #store: Map<string, unknown>;

  constructor(req: Request, params: ParamsToRecord<ParamKeys<P>>) {
    this.path = getPath(req) as P;
    this.method = req.method;

    this.req = new SpectraRequest(req, params);
    this.#headers = new Headers();
    this.#store = new Map();
  }

  setHeader(name: OutgoingHttpHeaders | (string & {}), value: string): void {
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
}
