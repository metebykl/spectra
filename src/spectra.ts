import { Router, type RouteMatch } from "./router";

import type { Handler, HTTPMethod } from "./types";

export class Spectra<BasePath extends string = "/"> {
  private _basePath: BasePath;
  private router: Router<Handler<any>>;

  constructor(basePath?: BasePath) {
    this._basePath = (basePath ?? "/") as BasePath;
    this.router = new Router<Handler<any>>();
  }

  all<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("ALL", path, handler);
    return this;
  }

  get<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("GET", path, handler);
    return this;
  }

  put<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("PUT", path, handler);
    return this;
  }

  post<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("POST", path, handler);
    return this;
  }

  delete<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("DELETE", path, handler);
    return this;
  }

  patch<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("PATCH", path, handler);
    return this;
  }

  head<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("HEAD", path, handler);
    return this;
  }

  options<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("OPTIONS", path, handler);
    return this;
  }

  trace<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("TRACE", path, handler);
    return this;
  }

  connect<Path extends string>(path: Path, handler: Handler<Path>): this {
    this.router.add("CONNECT", path, handler);
    return this;
  }

  match<Path extends string>(
    method: HTTPMethod,
    path: Path
  ): RouteMatch<Handler<Path>> | null {
    const match = this.router.match(method, path);
    return match;
  }
}
