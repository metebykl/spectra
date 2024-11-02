import http from "http";

import { Context } from "../../context";
import { SpectraRequest } from "../../request";
import { NodeRequest } from "./request";
import type { HTTPMethod, ParamKeys, ParamsToRecord } from "../../types";

export class NodeContext<Path extends string> implements Context<Path> {
  method: HTTPMethod;
  path: Path;
  req: SpectraRequest<Path>;

  private _res: http.ServerResponse;

  constructor(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    params: ParamsToRecord<ParamKeys<Path>>
  ) {
    this.method = req.method as HTTPMethod;
    this.path = req.url as Path;

    this._res = res;

    this.req = new NodeRequest(req, req.url as Path, params);
  }

  setHeader(name: string, value: string | number): void {
    this._res.setHeader(name, value);
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

  html(data: string, status = 200): void {
    this._res.statusCode = status;
    this._res.setHeader("Content-Type", "text/html");
    this._res.end(data);
  }
}
