import http from "http";

import { Spectra } from "../../spectra";
import { NodeContext } from "./context";

import type { HTTPMethod } from "../../types";

export interface NodeServeOptions {
  port?: number;
}

export function serve(
  app: Spectra,
  { port }: NodeServeOptions = { port: 8282 }
) {
  const server = http.createServer((req, res) => {
    const method = req.method as HTTPMethod;
    const url = req.url || "/";

    const context = new NodeContext<any>(req, res);
    const handler = app.getHandler(method, url);

    if (handler) {
      handler(context);
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
