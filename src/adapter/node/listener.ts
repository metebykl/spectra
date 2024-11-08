import { IncomingMessage, ServerResponse } from "node:http";
import { convertIncomingMessageToRequest } from "./request";
import { buildOutgoingHttpHeaders } from "./utils";
import type { FetchCallback } from "./types";

export const getListener = (fetchCallback: FetchCallback) => {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`);

    const request = convertIncomingMessageToRequest(url, req);
    const response = (await fetchCallback(request)) as Response;

    sendResponse(response, res);
  };
};

const sendResponse = async (res: Response, outgoing: ServerResponse) => {
  const headers = buildOutgoingHttpHeaders(res.headers);

  if (res.body) {
    const buffer = await res.arrayBuffer();
    headers["content-length"] = buffer.byteLength;

    outgoing.writeHead(res.status, headers);
    outgoing.end(new Uint8Array(buffer));
  } else {
    outgoing.writeHead(res.status, headers);
    outgoing.end();
  }
};
