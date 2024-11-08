import type { Context } from "./context";

export type Next = () => Promise<void>;
export type HandlerResponse = Response;

export type Handler<P extends string = any> = (
  c: Context<P>
) => HandlerResponse;

export type MiddlewareHandler<P extends string = string> = (
  context: Context<P>,
  next: Next
) => Promise<Response | void>;

export type H<P extends string = any> = Handler<P> | MiddlewareHandler<P>;

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

export type URLParams = Record<string, string>;

type ParamKey<Component> = Component extends `:${infer Name}` ? Name : never;

export type ParamKeys<Path extends string> =
  Path extends `${infer Key}/${infer Rest}`
    ? ParamKey<Key> | ParamKeys<Rest>
    : ParamKey<Path>;

export type ParamsToRecord<Param extends string> = { [K in Param]: string };

export type MergePath<A extends string, B extends string> = B extends ""
  ? MergePath<A, "/">
  : A extends ""
    ? B
    : A extends "/"
      ? B
      : A extends `${infer P}/`
        ? B extends `/${infer Q}`
          ? `${P}/${Q}`
          : `${P}/${B}`
        : B extends `/${infer Q}`
          ? Q extends ""
            ? A
            : `${A}/${Q}`
          : `${A}/${B}`;

// type ExtractMethod<T extends string> = T extends `${infer Method} ${string}`
//   ? Method extends HTTPMethod
//     ? Method
//     : never
//   : never;
