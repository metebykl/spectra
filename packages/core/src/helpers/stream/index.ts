import type { Context } from "../../context";
import { StreamAPI } from "../../utils/stream";

export const stream = (
  c: Context,
  cb: (stream: StreamAPI) => Promise<void>,
  onError?: (e: Error, stream: StreamAPI) => Promise<void>
): Response => {
  const { readable, writable } = new TransformStream();
  const stream = new StreamAPI(writable, readable);

  c.req.raw.signal.addEventListener("abort", () => {
    if (!stream.closed) {
      stream.abort();
    }
  });

  (async () => {
    try {
      await cb(stream);
    } catch (err) {
      if (err instanceof Error && onError) {
        await onError(err, stream);
      } else {
        console.error(err);
      }
    } finally {
      stream.close();
    }
  })();

  return c.body(stream.readable);
};
