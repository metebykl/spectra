import { describe, test, expect } from "vitest";
import { bodyLimit } from ".";
import { Spectra } from "../../spectra";

describe("Body Limit Middleware", () => {
  const app = new Spectra();

  const text = "X".repeat(12);
  const longText = "X".repeat(20);

  app.use("*", bodyLimit({ maxSize: 16 }));

  app.get("/", (c) => c.text("Spectra"));
  app.post("/", async (c) => {
    return c.text(await c.req.raw.text());
  });

  describe("GET request", () => {
    test("Should return 200 response", async () => {
      const res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Spectra");
    });
  });

  const buildRequest = (path: string, init: RequestInit = {}): Request => {
    const headers: Record<string, string> = {
      "Content-Type": "text/plain",
    };

    if (typeof init.body === "string") {
      headers["Content-Length"] = init.body.length.toString();
    }

    const reqInit = {
      method: "POST",
      headers,
      body: null,
      ...init,
      duplex: "half",
    } as RequestInit & { duplex: "half" };

    return new Request(path, reqInit);
  };

  describe("POST request", () => {
    test("Should return 200 response - string", async () => {
      const res = await app.fetch(
        buildRequest("http://localhost/", { body: text })
      );
      expect(res.status).toBe(200);
      expect(await res.text()).toBe(text);
    });

    test("Should return 413 response - string", async () => {
      const res = await app.fetch(
        buildRequest("http://localhost/", { body: longText })
      );
      expect(res.status).toBe(413);
      expect(await res.text()).toBe("Content Too Large");
    });

    test("Should return 200 response - ReadableStream", async () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("Spec"));
          controller.enqueue(new TextEncoder().encode("tra"));
          controller.close();
        },
      });
      const res = await app.fetch(
        buildRequest("http://localhost/", { body: stream })
      );

      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Spectra");
    });

    test("Should return 413 response - ReadableStream", async () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(longText));
          controller.close();
        },
      });
      const res = await app.fetch(
        buildRequest("http://localhost/", { body: stream })
      );

      expect(res.status).toBe(413);
      expect(await res.text()).toBe("Content Too Large");
    });
  });

  describe("Custom error handler", () => {
    const app = new Spectra();

    app.use(
      "*",
      bodyLimit({
        maxSize: 16,
        onError: (c) => c.text("Custom", 413),
      })
    );

    app.get("/", (c) => c.text("Spectra"));
    app.post("/", async (c) => {
      return c.text(await c.req.raw.text());
    });

    test("Should return the custom error handler", async () => {
      const res = await app.fetch(
        buildRequest("http://localhost/", { body: longText })
      );
      expect(res.status).toBe(413);
      expect(await res.text()).toBe("Custom");
    });
  });
});
