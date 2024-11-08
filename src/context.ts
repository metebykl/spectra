import { SpectraRequest } from "./request";
import type { ParamKeys, ParamsToRecord } from "./types";
import type { OutgoingHttpHeaders } from "./utils/headers";

export type Data = string | ArrayBuffer | ReadableStream;

export class Context<P extends string = "/"> {
  path: P;
  method: string;
  req: SpectraRequest<P>;

  private rawRequest: Request;
  private headers: Headers;

  constructor(req: Request, params: ParamsToRecord<ParamKeys<P>>) {
    this.path = req.url as P;
    this.method = req.method;

    this.rawRequest = req;
    this.req = new SpectraRequest(req, req.url, params);
    this.headers = new Headers();
  }

  setHeader(name: OutgoingHttpHeaders | (string & {}), value: string): void {
    this.headers.set(name, value);
  }

  private newResponse(data: Data | null, arg?: ResponseInit): Response {
    return new Response(data, {
      status: arg?.status,
      headers: this.headers,
    });
  }

  json(data: unknown, status = 200): Response {
    const body = JSON.stringify(data);

    this.headers.set("Content-Type", "application/json");
    return this.newResponse(body, { status });
  }

  text(data: string, status = 200): Response {
    this.headers.set("Content-Type", "text/plain");
    return this.newResponse(data, { status });
  }

  html(data: string, status = 200): Response {
    this.headers.set("Content-Type", "text/html");
    return this.newResponse(data, { status });
  }

  redirect(location: string, status = 302): Response {
    this.headers.set("Location", location);
    return this.newResponse(null, { status });
  }
}
