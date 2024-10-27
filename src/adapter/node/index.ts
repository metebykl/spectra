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

    const match = app.match(method, url);
    if (!match) {
      // TODO: Implement 404
      return;
    }

    const context = new NodeContext(req, res, match.params);
    match.handler(context);
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
