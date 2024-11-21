import { describe, test, expect } from "vitest";
import { compression } from ".";
import { Spectra } from "../../spectra";

describe("Compression Middleware", () => {
  const app = new Spectra();

  app.use(compression());

  app.get("/small", (c) => {
    c.header("Content-Length", "7");
    return c.text("Example");
  });
  app.get("/large", (c) => {
    c.header("Content-Length", "2048");
    return c.text("s".repeat(2048));
  });

  app.get("/small-json", (c) => {
    c.header("Content-Length", "7");
    return c.json({ data: "Example" });
  });
  app.get("/large-json", (c) => {
    c.header("Content-Length", "2048");
    return c.json({ data: "s".repeat(2048) });
  });

  app.get("/no-transform", (c) => {
    c.header("Content-Length", "2048");
    c.header("Cache-Control", "no-transform");
    return c.text("s".repeat(2048));
  });

  const expectCompression = async (
    path: string,
    accept: string,
    expected: string | null
  ): Promise<Response> => {
    const req = new Request(`http://localhost${path}`, {
      method: "GET",
      headers: new Headers({ "Accept-Encoding": accept }),
    });

    const res = await app.fetch(req);
    expect(res.headers.get("Content-Encoding")).toBe(expected);

    return res;
  };

  const decompressBody = async (res: Response): Promise<string> => {
    const stream = res.body?.pipeThrough(new DecompressionStream("gzip"));
    const response = new Response(stream);
    return response.text();
  };

  describe("compress text", () => {
    test("should compress large response gzip", async () => {
      const res = await expectCompression("/large", "gzip", "gzip");
      expect(res.headers.get("Content-Length")).toBeNull();
      expect((await res.arrayBuffer()).byteLength).toBeLessThan(2048);
    });

    test("should compress large response deflate", async () => {
      const res = await expectCompression("/large", "deflate", "deflate");
      expect(res.headers.get("Content-Length")).toBeNull();
      expect((await res.arrayBuffer()).byteLength).toBeLessThan(2048);
    });

    test("should prioritize gzip over deflate", async () => {
      const res = await expectCompression("/large", "gzip,deflate", "gzip");
      expect(res.headers.get("Content-Length")).toBeNull();
      expect((await res.arrayBuffer()).byteLength).toBeLessThan(2048);
    });

    test("should not compress below threshold", async () => {
      const res = await expectCompression("/small", "gzip,deflate", null);
      expect(await res.text()).toBe("Example");
    });
  });

  describe("compress json", () => {
    const expectedSmall = { data: "Example" };
    const expectedLarge = { data: "s".repeat(2048) };

    test("should compress large response gzip", async () => {
      const res = await expectCompression("/large-json", "gzip", "gzip");
      expect(res.headers.get("Content-Length")).toBeNull();

      const decompressed = await decompressBody(res);
      const json = JSON.parse(decompressed);
      expect(json).toEqual(expectedLarge);
    });

    test("should not compress below threshold", async () => {
      const res = await expectCompression("/small-json", "gzip,deflate", null);
      expect(await res.json()).toEqual(expectedSmall);
    });
  });

  test("should not compress cache-control no-transform", async () => {
    const res = await expectCompression("/no-transform", "gzip,deflate", null);
    expect(res.headers.get("Content-Length")).toBe("2048");
    expect((await res.arrayBuffer()).byteLength).toBe(2048);
  });
});
