import http from "http";

import { SpectraRequest } from "../../request";
import { getQueryParam } from "../../utils/url";
import type { ParamKeys, ParamsToRecord } from "../../types";

export class NodeRequest<P extends string = "/"> implements SpectraRequest<P> {
  raw: http.IncomingMessage;
  path: P;

  private _params: ParamsToRecord<ParamKeys<P>>;
  private _headers: Record<string, string>;

  private body: Promise<Buffer>;

  constructor(
    req: http.IncomingMessage,
    path: P,
    params: ParamsToRecord<ParamKeys<P>>
  ) {
    this.raw = req;
    this.path = path;

    this._params = params;
    this._headers = req.headers as Record<string, string>;

    this.body = new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  }

  param<K extends ParamKeys<P>>(key: K): string {
    return this._params[key];
  }

  params(): ParamsToRecord<ParamKeys<P>> {
    return this._params;
  }

  query(key: string): string | undefined;
  query(): Record<string, string>;
  query(key?: string) {
    return getQueryParam(this.path, key);
  }

  queries(key: string): string[] | undefined;
  queries(): Record<string, string[]>;
  queries(key?: string) {
    return getQueryParam(this.path, key, true);
  }

  header(name: string): string | undefined {
    const key = name.toLowerCase();
    return this._headers[key];
  }

  async json(): Promise<any> {
    const text = await this.text();
    return JSON.parse(text);
  }

  async text(): Promise<string> {
    const buffer = await this.body;
    return buffer.toString("utf-8");
  }
}
