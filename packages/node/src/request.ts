import type { IncomingMessage } from "node:http";
import { Readable } from "node:stream";

export const convertIncomingMessageToRequest = (
  url: URL,
  r: IncomingMessage,
  abortController?: AbortController
): Request => {
  const controller = abortController ?? new AbortController();
  const init = {
    method: r.method,
    headers: r.headers,
    duplex: "half",
    signal: controller.signal,
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

  if (r.method !== "GET" && r.method !== "HEAD") {
    init.body = Readable.toWeb(r) as ReadableStream<Uint8Array>;
  }

  return new Request(url, init);
};
