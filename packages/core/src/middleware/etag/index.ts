import type { MiddlewareHandler } from "../../types";
import { etagCompare, generateDigest } from "./utils";

interface ETagOptions {
  weak?: boolean;
  allowedHeaders?: string[];
  hashFn?: ETagHashFunction;
}

export type ETagHashFunction = (
  body: Uint8Array
) => ArrayBuffer | Promise<ArrayBuffer>;

export const ALLOWED_HEADERS_304 = [
  "cache-control",
  "content-location",
  "date",
  "etag",
  "expires",
  "vary",
];

const initializeHashFn = (hashFn?: ETagHashFunction) => {
  if (!hashFn) {
    if (crypto && crypto.subtle) {
      hashFn = (body: Uint8Array) =>
        crypto.subtle.digest({ name: "SHA-1" }, body);
    }
  }

  return hashFn;
};

export const etag = (options?: ETagOptions): MiddlewareHandler => {
  const weak = options?.weak ?? false;
  const allowedHeaders = options?.allowedHeaders ?? ALLOWED_HEADERS_304;
  const hashFn = initializeHashFn(options?.hashFn);

  return async function (c, next) {
    const ifNoneMatch = c.req.header("If-None-Match");

    await next();

    let etag = c.res.headers.get("ETag");
    if (!etag) {
      const body = c.res.clone().body;
      if (!body || !hashFn) {
        return;
      }

      const hash = await generateDigest(body, hashFn);
      if (!hash) {
        return;
      }

      etag = weak ? `W/"${hash}"` : `"${hash}"`;
    }

    if (etagCompare(etag, ifNoneMatch)) {
      c.res = new Response(null, {
        status: 304,
        statusText: "Not Modified",
        headers: {
          ETag: etag,
        },
      });

      c.res.headers.forEach((_, key) => {
        if (!allowedHeaders.includes(key.toLowerCase())) {
          c.res.headers.delete(key);
        }
      });
    } else {
      c.res.headers.set("ETag", etag);
    }
  };
};
