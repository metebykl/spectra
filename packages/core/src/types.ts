/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { Context } from "./context";
import type { Spectra } from "./spectra";
import type { CustomHeader, RequestHeader } from "./utils/headers";

///////////////////////////////////////
////                               ////
////           Handlers            ////
////                               ////
///////////////////////////////////////

export type Next = () => Promise<void>;
export type HandlerResponse = Response;

export type Handler<P extends string = any> = (
  c: Context<P>
) => HandlerResponse | Promise<HandlerResponse>;

export type MiddlewareHandler<P extends string = string> = (
  context: Context<P>,
  next: Next
) => Promise<Response | void>;

export type H<P extends string = any> = Handler<P> | MiddlewareHandler<P>;

export type ErrorHandler = (
  c: Context,
  err: Error
) => Response | Promise<Response>;

///////////////////////////////////////
////                               ////
////            Routes             ////
////                               ////
///////////////////////////////////////

export interface RouterNode {
  path: string;
  method: string;
  handler: H;
}

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

///////////////////////////////////////
////                               ////
////          URL Utils            ////
////                               ////
///////////////////////////////////////

export type URLParams = Record<string, string>;

type ParamKey<Component> = Component extends `:${infer Name}` ? Name : never;

export type ParamKeys<Path extends string> =
  Path extends `${infer Key}/${infer Rest}`
    ? ParamKey<Key> | ParamKeys<Rest>
    : ParamKey<Path>;

export type ParamsToRecord<Param extends string> = Record<Param, string>;

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

///////////////////////////////////////
////                               ////
////        RouteInterface         ////
////                               ////
///////////////////////////////////////

export interface RouteInterface<BasePath extends string = "/"> {
  // .get(path, handler)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    handler: Handler<MergedPath>
  ): Spectra;

  // .get(path, handler x 2)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [MiddlewareHandler<MergedPath>, Handler<MergedPath>]
  ): Spectra<BasePath>;

  // .get(path, handler x 3)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      Handler<MergedPath>,
    ]
  ): Spectra<BasePath>;

  // .get(path, handler x 4)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      Handler<MergedPath>,
    ]
  ): Spectra<BasePath>;

  // .get(path, handler x 5)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      Handler<MergedPath>,
    ]
  ): Spectra<BasePath>;

  // .get(path, handler x 6)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      Handler<MergedPath>,
    ]
  ): Spectra<BasePath>;

  // .get(path, handler x 7)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      Handler<MergedPath>,
    ]
  ): Spectra<BasePath>;

  // .get(path, handler x 8)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      Handler<MergedPath>,
    ]
  ): Spectra<BasePath>;

  // .get(path, handler x 9)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      Handler<MergedPath>,
    ]
  ): Spectra<BasePath>;

  // .get(path, handler x 10)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      MiddlewareHandler<MergedPath>,
      Handler<MergedPath>,
    ]
  ): Spectra<BasePath>;
}

///////////////////////////////////////
////                               ////
////          Validation           ////
////                               ////
///////////////////////////////////////

export type ValidationTargets = {
  json: any;
  form: Record<string, string | File | (string | File)[]>;
  query: Record<string, string | string[]>;
  params: Record<string, string>;
  headers: Record<RequestHeader | CustomHeader, string>;
};
