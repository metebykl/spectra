import { test, expect } from "vitest";
import { etagCompare, generateDigest } from "./utils";

test("etagCompare", () => {
  expect(etagCompare('"foo"', '"foo"')).toBe(true);
  expect(etagCompare('"foo"', '"foo","bar')).toBe(true);
});

test("generateDigest", async () => {
  const hashFn = (body: Uint8Array) =>
    crypto.subtle.digest({ name: "SHA-1" }, body);

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("hello"));
      controller.enqueue(new TextEncoder().encode("spectra!"));
      controller.close();
    },
  });

  expect(await generateDigest(stream, hashFn)).toBe(
    "fd3a48b17d28d0ccb3139406a5ab2bee6bd72af9"
  );
});
