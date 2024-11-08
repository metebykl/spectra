import { IncomingMessage } from "node:http";
import { Readable } from "node:stream";

export const convertIncomingMessageToRequest = (
  url: URL,
  r: IncomingMessage
): Request => {
  const init = {
    method: r.method,
    headers: r.headers,
    duplex: "half",
  } as RequestInit;

  if (r.method === "TRACE") {
    init.method = "GET";

    const req = new Request(url, init);
    Object.defineProperty(req, "method", {
      get() {
        return "TRACE";
      },
    });

    return req;
  }

  if (!(r.method === "GET" || r.method === "HEAD")) {
    init.body = Readable.toWeb(r) as ReadableStream<Uint8Array>;
  }

  return new Request(url, init);
};
