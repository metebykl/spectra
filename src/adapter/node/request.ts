import http from "http";
import { SpectraRequest } from "../../request";
import type { ParamKeys, ParamsToRecord } from "../../types";

export class NodeRequest<P extends string = "/"> implements SpectraRequest<P> {
  raw: http.IncomingMessage;
  path: P;
  #params: ParamsToRecord<ParamKeys<P>>;

  constructor(
    req: http.IncomingMessage,
    path: P,
    params: ParamsToRecord<ParamKeys<P>>
  ) {
    this.raw = req;
    this.path = path;
    this.#params = params;
  }

  param<K extends ParamKeys<P>>(key: K): string {
    return this.#params[key];
  }

  params(): ParamsToRecord<ParamKeys<P>> {
    return this.#params;
  }
}
