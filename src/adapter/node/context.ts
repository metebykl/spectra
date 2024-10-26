import http from "http";

import type { Context, ContextRequest } from "../../context";
import type { HTTPMethod, ParamKeys, ParamsToRecord } from "../../types";

export class NodeContext<Path extends string> implements Context<Path> {
  method: HTTPMethod;
  path: Path;
  req: ContextRequest<any>;

  _req: http.IncomingMessage;
  _res: http.ServerResponse;

  constructor(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    params: ParamsToRecord<ParamKeys<Path>>
  ) {
    this.method = req.method as HTTPMethod;
    this.path = req.url as Path;

    this._req = req;
    this._res = res;

    this.req = { params: params };
  }

  json(data: unknown, status = 200) {
    this._res.statusCode = status;
    this._res.setHeader("Content-Type", "application/json");
    this._res.end(JSON.stringify(data));
  }

  text(data: string, status = 200) {
    this._res.statusCode = status;
    this._res.setHeader("Content-Type", "text/plain");
    this._res.end(data);
  }
}
