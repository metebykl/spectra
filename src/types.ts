import type { Context } from "./context";

export type Handler<Path extends string = "/"> = (c: Context<Path>) => void;

export type Middleware<Path extends string = "*"> = (
  context: Context<Path>,
  next: () => Promise<void>
) => Promise<void> | void;

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
