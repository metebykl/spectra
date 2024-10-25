import type { ParamKeys, ParamsToRecord } from "./types";

export type Context<Path extends string> = {
  req: {
    params: ParamKeys<Path> extends never
      ? undefined
      : ParamsToRecord<ParamKeys<Path>>;
  };
};
