export type Handler<Path extends string> = {
  method: HTTPMethod;
  path: string;
  fn: (c: Context<Path>) => void;
};

export type Context<Path extends string> = {
  req: {
    params: ParamKeys<Path> extends never
      ? undefined
      : ParamsToRecord<ParamKeys<Path>>;
  };
};

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

type ParamKeys<Path extends string> = Path extends `${infer Key}/${infer Rest}`
  ? ParamKey<Key> | ParamKeys<Rest>
  : ParamKey<Path>;

type ParamsToRecord<Param extends string> = { [K in Param]: string };
