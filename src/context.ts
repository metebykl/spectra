import { SpectraRequest } from "./request";
import type { ParamKeys, ParamsToRecord } from "./types";
import type { OutgoingHttpHeaders } from "./utils/headers";

export type Data = string | ArrayBuffer | ReadableStream;

export class Context<P extends string = string> {
  path: P;
  method: string;
  req: SpectraRequest<P>;

  #status: number = 200;
  private headers: Headers;

  constructor(req: Request, path: P, params: ParamsToRecord<ParamKeys<P>>) {
    this.path = path;
    this.method = req.method;

    this.req = new SpectraRequest(req, params);
    this.headers = new Headers();
  }

  setHeader(name: OutgoingHttpHeaders | (string & {}), value: string): void {
    this.headers.set(name, value);
  }

  private newResponse(data: Data | null, status?: number): Response {
    return new Response(data, {
      status: status ?? this.#status,
      headers: this.headers,
    });
  }

  status(code: number): void {
    this.#status = code;
  }

  json(data: unknown, status?: number): Response {
    const body = JSON.stringify(data);

    this.headers.set("Content-Type", "application/json");
    return this.newResponse(body, status);
  }

  text(data: string, status?: number): Response {
    this.headers.set("Content-Type", "text/plain");
    return this.newResponse(data, status);
  }

  html(data: string, status?: number): Response {
    this.headers.set("Content-Type", "text/html");
    return this.newResponse(data, status);
  }

  redirect(location: string, status?: number): Response {
    this.headers.set("Location", location);
    return this.newResponse(null, status ?? 302);
  }
}
