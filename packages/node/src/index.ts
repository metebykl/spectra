import http from "node:http";
import type { AddressInfo } from "node:net";
import { getListener } from "./listener";
import type { FetchCallback } from "./types";

const DEFAULT_PORT = 8282;

export interface NodeServeOptions {
  fetch: FetchCallback;
  port?: number;
}

export function createAdapter(options: NodeServeOptions): http.Server {
  const requestListener = getListener(options.fetch);
  return http.createServer(requestListener);
}

export function serve(
  options: NodeServeOptions,
  listenCallback?: (info: AddressInfo) => void
): http.Server {
  const server = createAdapter(options);

  server.listen(options?.port ?? DEFAULT_PORT, () => {
    const serverInfo = server.address() as AddressInfo;
    listenCallback && listenCallback(serverInfo);
  });

  return server;
}
