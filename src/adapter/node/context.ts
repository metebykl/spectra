import http from "http";

import { Context } from "../../context";
import { SpectraRequest } from "../../request";
import { NodeRequest } from "./request";
import type { HTTPMethod, ParamKeys, ParamsToRecord } from "../../types";

export class NodeContext<Path extends string> implements Context<Path> {
  method: HTTPMethod;
  path: Path;
  req: SpectraRequest<Path>;

  private rawReq: http.IncomingMessage;
  private rawRes: http.ServerResponse;

  constructor(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    params: ParamsToRecord<ParamKeys<Path>>
  ) {
    this.method = req.method as HTTPMethod;
    this.path = req.url as Path;

    this.rawReq = req;
    this.rawRes = res;

    this.req = new NodeRequest(req, req.url as Path, params);
  }

  json(data: unknown, status = 200) {
    this.rawRes.statusCode = status;
    this.rawRes.setHeader("Content-Type", "application/json");
    this.rawRes.end(JSON.stringify(data));
  }

  text(data: string, status = 200) {
    this.rawRes.statusCode = status;
    this.rawRes.setHeader("Content-Type", "text/plain");
    this.rawRes.end(data);
  }
}
