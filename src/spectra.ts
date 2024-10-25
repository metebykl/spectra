import type { Context, Handler } from "./types";

export class Spectra<BasePath extends string = "/"> {
  private _basePath: BasePath;
  private handlers: Handler<string>[] = [];

  constructor(basePath?: BasePath) {
    this._basePath = (basePath ?? "/") as BasePath;
  }

  get<Path extends string>(path: Path, callbackFn: (c: Context<Path>) => void) {
    this.handlers.push({ method: "GET", path, fn: callbackFn });
  }

  put<Path extends string>(path: Path, callbackFn: (c: Context<Path>) => void) {
    this.handlers.push({ method: "PUT", path, fn: callbackFn });
  }

  post<Path extends string>(
    path: Path,
    callbackFn: (c: Context<Path>) => void
  ) {
    this.handlers.push({ method: "POST", path, fn: callbackFn });
  }

  delete<Path extends string>(
    path: Path,
    callbackFn: (c: Context<Path>) => void
  ) {
    this.handlers.push({ method: "DELETE", path, fn: callbackFn });
  }

  patch<Path extends string>(
    path: Path,
    callbackFn: (c: Context<Path>) => void
  ) {
    this.handlers.push({ method: "PATCH", path, fn: callbackFn });
  }

  head<Path extends string>(
    path: Path,
    callbackFn: (c: Context<Path>) => void
  ) {
    this.handlers.push({ method: "HEAD", path, fn: callbackFn });
  }

  options<Path extends string>(
    path: Path,
    callbackFn: (c: Context<Path>) => void
  ) {
    this.handlers.push({ method: "OPTIONS", path, fn: callbackFn });
  }

  trace<Path extends string>(
    path: Path,
    callbackFn: (c: Context<Path>) => void
  ) {
    this.handlers.push({ method: "TRACE", path, fn: callbackFn });
  }

  connect<Path extends string>(
    path: Path,
    callbackFn: (c: Context<Path>) => void
  ) {
    this.handlers.push({ method: "CONNECT", path, fn: callbackFn });
  }
}
