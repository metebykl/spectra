import type { HTTPMethod, ParamKeys, ParamsToRecord } from "./types";

export type ContextRequest<Path extends string> = {
  params: ParamKeys<Path> extends never
    ? undefined
    : ParamsToRecord<ParamKeys<Path>>;
};

export interface Context<Path extends string> {
  method: HTTPMethod;
  path: Path;

  req: ContextRequest<Path>;

  json(data: unknown, status?: number): void;
  text(data: string, status?: number): void;
}
