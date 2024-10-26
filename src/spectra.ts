import { Router, type RouteMatch } from "./router";

import type { Handler, HTTPMethod } from "./types";

export class Spectra<BasePath extends string = "/"> {
  /**
   * Not Implemented!
   * @todo
   */
  private _basePath: BasePath;

  private router: Router<Handler<any>>;

  constructor(basePath?: BasePath) {
    this._basePath = (basePath ?? "/") as BasePath;
    this.router = new Router<Handler<any>>();
  }

  all<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("ALL", path, handler);
  }

  get<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("GET", path, handler);
  }

  put<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("PUT", path, handler);
  }

  post<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("POST", path, handler);
  }

  delete<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("DELETE", path, handler);
  }

  patch<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("PATCH", path, handler);
  }

  head<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("HEAD", path, handler);
  }

  options<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("OPTIONS", path, handler);
  }

  trace<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("TRACE", path, handler);
  }

  connect<Path extends string>(path: Path, handler: Handler<Path>) {
    this.router.add("CONNECT", path, handler);
  }

  match<Path extends string>(
    method: HTTPMethod,
    path: Path
  ): RouteMatch<Handler<Path>> | null {
    const match = this.router.match(method, path);
    return match;
  }
}
