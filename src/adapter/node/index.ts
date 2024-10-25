import { Spectra } from "../../spectra";

export interface NodeServeOptions {
  port?: number;
}

export function serve(
  srv: Spectra,
  options: NodeServeOptions = { port: 8080 }
) {
  console.log("server listening on port", options.port);
}
