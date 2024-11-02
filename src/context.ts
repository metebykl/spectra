import { SpectraRequest } from "./request";
import type { OutgoingHttpHeaders } from "./utils/headers";
import type { HTTPMethod } from "./types";

export interface Context<Path extends string> {
  method: HTTPMethod;
  path: Path;
  req: SpectraRequest<Path>;

  setHeader(
    name: OutgoingHttpHeaders | (string & {}),
    value: string | number
  ): void;

  json(data: unknown, status?: number): void;
  text(data: string, status?: number): void;
  html(data: string, status?: number): void;
  redirect(location: string, status?: number): void;
}
