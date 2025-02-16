import type { ETagHashFn } from ".";

export const etagCompare = (etag: string, header?: string): boolean => {
  if (!header) {
    return false;
  }

  return header.split(",").some((e) => e.trim() === etag);
};

export const generateDigest = async (
  stream: ReadableStream<Uint8Array>,
  hashFn: ETagHashFn
): Promise<string | null> => {
  let buffer: ArrayBuffer | undefined = undefined;

  const reader = stream.getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    let body: Uint8Array | undefined = undefined;
    if (!buffer) {
      body = value;
    } else {
      body = new Uint8Array(buffer.byteLength + value.byteLength);
      body.set(new Uint8Array(buffer), 0);
      body.set(value, buffer.byteLength);
    }

    buffer = await hashFn(body);
  }

  if (!buffer) {
    return null;
  }

  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
