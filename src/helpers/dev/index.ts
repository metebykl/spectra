import type { Spectra } from "../../spectra";
import { isMiddleware } from "../../utils/handler";

interface ListRoutesOptions {
  verbose?: boolean;
  colorize?: boolean;
}

export const listRoutes = (app: Spectra, opts?: ListRoutesOptions) => {
  const routes = app.routes
    .map(({ path, method, handler }) => ({
      path,
      method,
      isMiddleware: isMiddleware(handler),
      tag:
        handler.name || (isMiddleware(handler) ? "[middleware]" : "[handler]"),
    }))
    .filter(({ isMiddleware }) => opts?.verbose || !isMiddleware);

  routes.forEach(({ path, method, tag }) => {
    const methodStr = opts?.colorize ? `\x1b[32m${method}\x1b[0m` : method;

    if (opts?.verbose) {
      console.log(`${methodStr} ${path} ${tag}`);
    } else {
      console.log(`${methodStr} ${path}`);
    }
  });
};
