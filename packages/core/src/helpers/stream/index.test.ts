import { describe, test, expect, beforeEach, vi } from "vitest";
import { Context } from "../../context";
import { stream } from ".";

function expectToBeTruthy<T>(value: T): asserts value is NonNullable<T> {
  expect(value).toBeTruthy();
}

describe("Stream Helper", () => {
  const req = new Request("http://localhost/");

  let c: Context;
  beforeEach(() => {
    c = new Context(req, {});
  });

  test("Should return correct response", async () => {
    const res = stream(c, async (stream) => {
      for (let i = 0; i < 3; i++) {
        await stream.write(new Uint8Array([i]));
        await stream.sleep(1);
      }
    });
    expectToBeTruthy(res.body);

    const reader = res.body.getReader();
    for (let i = 0; i < 3; i++) {
      const { value } = await reader.read();
      expect(value).toEqual(new Uint8Array([i]));
    }
  });

  test("Aborted by client", async () => {
    let aborted = false;
    const res = stream(c, async (stream) => {
      stream.onAbort(() => {
        aborted = true;
      });
      for (let i = 0; i < 3; i++) {
        await stream.write(new Uint8Array([i]));
        await stream.sleep(1);
      }
    });
    expectToBeTruthy(res.body);

    const reader = res.body.getReader();
    const { value } = await reader.read();
    expect(value).toEqual(new Uint8Array([0]));
    reader.cancel();
    expect(aborted).toBe(true);
  });

  test("Request aborted by signal", async () => {
    const controller = new AbortController();
    const req = new Request("http://localhost/", { signal: controller.signal });
    const c = new Context(req, {});

    let aborted = false;
    const res = stream(c, async (stream) => {
      stream.onAbort(() => {
        aborted = true;
      });
      for (let i = 0; i < 3; i++) {
        await stream.write(new Uint8Array([i]));
        await stream.sleep(1);
      }
    });
    expectToBeTruthy(res.body);

    const reader = res.body.getReader();
    const { value } = await reader.read();
    expect(value).toEqual(new Uint8Array([0]));
    controller.abort();
    expect(aborted).toBe(true);
  });

  test("Pipe aborted by signal", async () => {
    const controller = new AbortController();
    const req = new Request("http://localhost/", { signal: controller.signal });
    const c = new Context(req, {});

    let aborted = false;
    const res = stream(c, async (stream) => {
      stream.onAbort(() => {
        aborted = true;
      });
      await stream.pipe(new ReadableStream());
    });
    expectToBeTruthy(res.body);

    const reader = res.body.getReader();
    await controller.abort();
    await reader.read;
    expect(aborted).toBe(true);
  });

  test("Error handler", async () => {
    const onError = vi.fn();
    const res = stream(
      c,
      async () => {
        throw new Error("Failed");
      },
      onError
    );
    expectToBeTruthy(res.body);

    const reader = res.body.getReader();
    const { value } = await reader.read();
    expect(value).toBeUndefined();
    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(
      new Error("Failed"),
      expect.anything()
    );
  });
});
