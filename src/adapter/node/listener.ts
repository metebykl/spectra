import { IncomingMessage, ServerResponse } from "node:http";
import { convertIncomingMessageToRequest } from "./request";
import { buildOutgoingHttpHeaders } from "./utils";
import type { FetchCallback } from "./types";

const handleRequestError = () =>
  new Response(null, {
    status: 400,
  });

const handleResponseError = (e: unknown, res: ServerResponse) => {
  const err = (
    e instanceof Error ? e : new Error("unknown error", { cause: e })
  ) as Error & {
    code: string;
  };

  console.error(e);
  if (!res.headersSent) {
    res.writeHead(500, { "Content-Type": "text/plain" });
  }
  res.end(`Error: ${err.message}`);
  res.destroy(err);
};

const handleFetchError = (e: unknown) =>
  new Response(null, {
    status:
      e instanceof Error &&
      (e.name === "TimeoutError" || e.constructor.name === "TimeoutError")
        ? 504
        : 500,
  });

export const getListener = (fetchCallback: FetchCallback) => {
  return async (incoming: IncomingMessage, outgoing: ServerResponse) => {
    let req: Request | undefined;
    let res: Response | undefined;

    const url = new URL(
      `http://${process.env.HOST ?? "localhost"}${incoming.url}`
    );

    try {
      req = convertIncomingMessageToRequest(url, incoming);
      res = (await fetchCallback(req)) as Response;
    } catch (err) {
      if (!res) {
        if (!req) {
          res = handleRequestError();
        } else {
          res = handleFetchError(err);
        }
      } else {
        return handleResponseError(err, outgoing);
      }
    }

    try {
      if (!res) throw new Error("response is undefined");
      sendResponse(res, outgoing);
    } catch (err) {
      handleResponseError(err, outgoing);
    }
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
