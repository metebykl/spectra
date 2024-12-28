import { describe, test, expect, vi } from "vitest";
import { StreamAPI } from "./stream";

describe("StreamAPI", () => {
  test("write(string)", async () => {
    const { readable, writable } = new TransformStream();
    const api = new StreamAPI(writable, readable);
    const reader = api.readable.getReader();

    api.write("hello");
    expect((await reader.read()).value).toEqual(
      new TextEncoder().encode("hello")
    );
    api.write("world");
    expect((await reader.read()).value).toEqual(
      new TextEncoder().encode("world")
    );
  });

  test("write(Uint8Array)", async () => {
    const { readable, writable } = new TransformStream();
    const api = new StreamAPI(writable, readable);
    const reader = api.readable.getReader();

    api.write(new Uint8Array([1, 2, 3]));
    expect((await reader.read()).value).toEqual(new Uint8Array([1, 2, 3]));
    api.write(new Uint8Array([4, 5, 6]));
    expect((await reader.read()).value).toEqual(new Uint8Array([4, 5, 6]));
  });

  test("writeln(string)", async () => {
    const { readable, writable } = new TransformStream();
    const api = new StreamAPI(writable, readable);
    const reader = api.readable.getReader();

    api.writeln("hello");
    expect((await reader.read()).value).toEqual(
      new TextEncoder().encode("hello\n")
    );
    api.writeln("world");
    expect((await reader.read()).value).toEqual(
      new TextEncoder().encode("world\n")
    );
  });

  test("pipe()", async () => {
    const { readable: sReadable, writable: sWritable } = new TransformStream();
    const { readable: rReadable, writable: rWritable } = new TransformStream();
    const api = new StreamAPI(rWritable, rReadable);

    // write data to sender writable
    (async () => {
      const writer = sWritable.getWriter();
      await writer.write(new TextEncoder().encode("foo"));
      await writer.write(new TextEncoder().encode("bar"));
    })();

    // pipe data to api
    (async () => {
      await api.pipe(sReadable);
    })();

    const reader = api.readable.getReader();
    expect((await reader.read()).value).toEqual(
      new TextEncoder().encode("foo")
    );
    expect((await reader.read()).value).toEqual(
      new TextEncoder().encode("bar")
    );
  });

  test("close()", async () => {
    const { readable, writable } = new TransformStream();
    const api = new StreamAPI(writable, readable);
    const reader = api.readable.getReader();

    await api.close();
    expect((await reader.read()).done).toBe(true);
  });

  test("onAbort()", async () => {
    const { readable, writable } = new TransformStream();
    const api = new StreamAPI(writable, readable);

    const abortFn1 = vi.fn();
    const abortFn2 = vi.fn();
    api.onAbort(abortFn1);
    api.onAbort(abortFn2);

    expect(abortFn1).not.toBeCalled();
    expect(abortFn2).not.toBeCalled();
    await api.readable.cancel();
    expect(abortFn1).toBeCalled();
    expect(abortFn2).toBeCalled();
  });

  test("abort()", async () => {
    const { readable, writable } = new TransformStream();
    const api = new StreamAPI(writable, readable);

    const abortFn1 = vi.fn();
    const abortFn2 = vi.fn();
    api.onAbort(abortFn1);
    api.onAbort(abortFn2);

    expect(abortFn1).not.toBeCalled();
    expect(abortFn2).not.toBeCalled();
    expect(api.aborted).toBe(false);

    api.abort();
    expect(abortFn1).toHaveBeenCalledOnce();
    expect(abortFn2).toHaveBeenCalledOnce();
    expect(api.aborted).toBe(true);

    // should not call listeners twice when the stream is aborted
    api.abort();
    expect(abortFn1).toHaveBeenCalledOnce();
    expect(abortFn2).toHaveBeenCalledOnce();
    expect(api.aborted).toBe(true);
  });
});
