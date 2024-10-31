import type { ParamKeys, ParamsToRecord } from "./types";

export interface SpectraRequest<P extends string = "/"> {
  path: P;

  param<K extends ParamKeys<P>>(key: K): string;
  params(): ParamsToRecord<ParamKeys<P>>;

  query(key: string): string | undefined;
  query(): Record<string, string>;

  queries(key: string): string[] | undefined;
  queries(): Record<string, string[]>;

  header(name: string): string | undefined;

  json(): Promise<any>;
  text(): Promise<string>;
}
