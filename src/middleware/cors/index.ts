import type { Context } from "../../context";
import type { MiddlewareHandler } from "../../types";

interface CORSOptions {
  origin: string | string[] | ((c: Context) => string | undefined | null);
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposeHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
}

export const cors = (options?: CORSOptions): MiddlewareHandler => {
  const defaults: CORSOptions = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: "*",
    exposeHeaders: "*",
    credentials: true,
    maxAge: 5,
  };

  const opts = {
    ...defaults,
    ...options,
  };

  const isAllowedOrigin = (
    origin: string,
    c: Context
  ): string | null | undefined => {
    if (typeof opts.origin === "string") {
      if (opts.origin === "*") {
        return "*";
      } else {
        return opts.origin === origin ? origin : null;
      }
    } else if (typeof opts.origin === "function") {
      return opts.origin(c);
    } else {
      return opts.origin.includes(origin) ? origin : null;
    }
  };

  const getOption = (option: string | string[] | undefined): string | null => {
    if (option) {
      if (Array.isArray(option)) {
        return option.length > 0 ? option.join(",") : null;
      } else {
        return option;
      }
    }

    return null;
  };

  return async function (c, next) {
    const set = (key: string, value: string, append?: boolean) => {
      if (append) {
        c.res.headers.append(key, value);
      } else {
        c.res.headers.set(key, value);
      }
    };

    const origin = isAllowedOrigin(c.req.header("Origin") || "", c);
    if (origin) {
      c.res.headers.set("Access-Control-Allow-Origin", origin);
    }

    /*
      If the server specifies a single origin (that may dynamically change based on the requesting origin as part of an allowlist) rather than the * wildcard, then the server should also include Origin in the Vary response header to indicate to clients that server responses will differ based on the value of the Origin request header.
      
      https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    */
    if (opts.origin !== "*") {
      const vary = c.req.header("Vary");

      if (vary) {
        set("Vary", vary);
      } else {
        set("Vary", "Origin");
      }
    }

    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }

    const exposeHeaders = getOption(opts.exposeHeaders);
    if (exposeHeaders) {
      set("Access-Control-Expose-Headers", exposeHeaders);
    }

    if (c.method === "OPTIONS") {
      if (opts.maxAge !== undefined) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }

      const methods = getOption(opts.methods);
      if (methods) {
        set("Access-Control-Allow-Methods", methods);
      }

      let headers = getOption(opts.allowedHeaders);
      if (!headers) {
        const reqHeaders = c.req.header("Access-Control-Request-Headers");
        if (reqHeaders) {
          headers = reqHeaders;
        }
      }

      if (headers) {
        set("Access-Control-Allow-Headers", headers);
        set("Vary", "Access-Control-Request-Headers", true);
      }

      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");

      return new Response(null, {
        headers: c.res.headers,
        status: 204,
      });
    }

    await next();
  };
};
