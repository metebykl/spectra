import { getPath, getQueryParam } from "./utils/url";
import type { ParamKeys, ParamsToRecord } from "./types";
import type { IncomingHttpHeaders } from "./utils/headers";

export class SpectraRequest<P extends string = "/"> {
  raw: Request;
  path: string;

  #params: ParamsToRecord<ParamKeys<P>>;

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
    const key = name.toLowerCase();
    return this.raw.headers.get(key) ?? undefined;
  }

  async json(): Promise<any> {
    return await this.raw.json();
  }

  async text(): Promise<string> {
    return await this.raw.text();
  }
}
