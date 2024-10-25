import type { Context } from "./context";

export type Handler<Path extends string> = (c: Context<Path>) => void;

export type HTTPMethod =
  | "GET"
  | "PUT"
  | "POST"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS"
  | "TRACE"
  | "CONNECT";

type ExtractMethod<T extends string> = T extends `${infer Method} ${string}`
  ? Method extends HTTPMethod
    ? Method
    : never
  : never;

type ParamKey<Component> = Component extends `:${infer Name}` ? Name : never;

export type ParamKeys<Path extends string> =
  Path extends `${infer Key}/${infer Rest}`
    ? ParamKey<Key> | ParamKeys<Rest>
    : ParamKey<Path>;

export type ParamsToRecord<Param extends string> = { [K in Param]: string };
