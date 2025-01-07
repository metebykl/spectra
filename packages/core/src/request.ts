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

  query<T extends Record<string, string | undefined>>(): T;
  query<T extends Record<string, string | undefined>, K = keyof T>(
    key: K
  ): K extends keyof T ? T[K] : undefined;
  query<T extends Record<string, string | undefined>>(key?: keyof T) {
    return getQueryParam(this.raw.url, key as string);
  }

  queries<T extends Record<string, string[]>>(): T;
  queries<T extends Record<string, string[]>>(key: keyof T): string[];
  queries<T extends Record<string, string[]>>(key?: keyof T) {
    return getQueryParam(this.raw.url, key as string, true);
  }

  header(name: IncomingHttpHeaders | (string & {})): string | undefined {
    const key = name.toLowerCase();
    return this.raw.headers.get(key) ?? undefined;
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
