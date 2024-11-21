import type { MiddlewareHandler } from "../../types";

const ENCODING_TYPES = ["gzip", "deflate"] as const;
const NO_TRANSFORM_REGEX = /(?:^|,)\s*?no-transform\s*?(?:,|$)/i;

interface CompressionOptions {
  /**
   * Specifies the encoding algorithm to use for compression.
   * Can be either "gzip" or "deflate". If not specified, the middleware
   * will choose based on the `Accept-Encoding` headers.
   */
  encoding?: "gzip" | "deflate";

  /**
   * Specifies the minimum size in bytes to compress.
   * @default 1024
   */
  threshold?: number;
}

export const compression = (
  options?: CompressionOptions
): MiddlewareHandler => {
  const threshold = options?.threshold ?? 1024;

  return async function (c, next) {
    await next();

    const contentLength = c.res.headers.get("Content-Length");
    const cacheControl = c.res.headers.get("Cache-Control");

    if (
      !c.res.body ||
      c.method === "HEAD" ||
      c.res.headers.has("Content-Encoding") ||
      (contentLength && Number(contentLength) < threshold) ||
      (cacheControl && NO_TRANSFORM_REGEX.test(cacheControl))
    ) {
      return;
    }

    const accepts = c.req.header("Accept-Encoding");
    const encoding = ENCODING_TYPES.find((enc) => accepts?.includes(enc));
    if (!encoding) {
      return;
    }

    const stream = new CompressionStream(encoding);
    c.res = new Response(c.res.body.pipeThrough(stream), c.res);
    c.res.headers.set("Content-Encoding", encoding);
    c.res.headers.delete("Content-Length");
  };
};
