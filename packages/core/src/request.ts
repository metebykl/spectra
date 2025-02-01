/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPath, getQueryParam } from "./utils/url";
import type { ParamKeys, ParamsToRecord } from "./types";
import type { IncomingHttpHeaders } from "./utils/headers";

type Body = {
  text?: string;
  json?: any;
  arrayBuffer?: ArrayBuffer;
  blob?: Blob;
  formData?: FormData;
};

export class SpectraRequest<P extends string = "/"> {
  raw: Request;
  path: string;

  #params: ParamsToRecord<ParamKeys<P>>;
  #body: Body = {};

  constructor(request: Request, params: ParamsToRecord<ParamKeys<P>>) {
    this.raw = request;
    this.path = getPath(request);
    this.#params = params;
  }

  param<K extends ParamKeys<P>>(key: K): string {
    return this.#params[key];
  }

  params(): ParamsToRecord<ParamKeys<P>> {
    return this.#params;
  }

  query(key: string): string | undefined;
  query(): Record<string, string>;
  query(key?: string) {
    return getQueryParam(this.raw.url, key);
  }

  queries(key: string): string[] | undefined;
  queries(): Record<string, string[]>;
  queries(key?: string) {
    return getQueryParam(this.raw.url, key, true);
  }

  header(name: IncomingHttpHeaders | (string & {})): string | undefined {
    return this.raw.headers.get(name) ?? undefined;
  }

  async #parseBody(key: keyof Body) {
    const cache = this.#body[key];
    if (cache) return cache;

    return (this.#body[key] = this.raw[key]());
  }

  async json<T = any>(): Promise<T> {
    return await this.#parseBody("json");
  }

  async text(): Promise<string> {
    return await this.#parseBody("text");
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return await this.#parseBody("arrayBuffer");
  }

  async formData(): Promise<FormData> {
    return await this.#parseBody("formData");
  }

  async blob(): Promise<Blob> {
    return await this.#parseBody("blob");
  }
}
