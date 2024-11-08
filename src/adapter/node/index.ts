import http from "node:http";
import { AddressInfo } from "node:net";
import { getListener } from "./listener";
import { FetchCallback } from "./types";

const DEFAULT_PORT = 8282;

export interface NodeServeOptions {
  fetch: FetchCallback;
  port?: number;
}

export function serve(
  options: NodeServeOptions,
  listenCallback?: (info: AddressInfo) => void
): http.Server {
  const requestListener = getListener(options.fetch);
  const server = http.createServer(requestListener);

  server.listen(options?.port ?? DEFAULT_PORT, () => {
    const serverInfo = server.address() as AddressInfo;
    listenCallback && listenCallback(serverInfo);
  });

  return server;
}
