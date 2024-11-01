import { SpectraRequest } from "./request";
import type { HTTPMethod } from "./types";

export interface Context<Path extends string> {
  method: HTTPMethod;
  path: Path;

  req: SpectraRequest<Path>;

  json(data: unknown, status?: number): void;
  text(data: string, status?: number): void;
  html(data: string, status?: number): void;
}
