import { describe, test, expect } from "vitest";
import { requestId } from ".";
import { Spectra } from "../../spectra";

const regexUUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("Request Id Middleware", () => {
  describe("Basic", () => {
    const app = new Spectra();

    app.use(requestId());
    app.get("/", (c) => c.text("Spectra!"));

    test("Should generate request id", async () => {
      const res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Request-Id")).toMatch(regexUUID);
      expect(await res.text()).toBe("Spectra!");
    });

    test("Should return existing request id", async () => {
      const res = await app.fetch(
        new Request("http://localhost/", {
          headers: { "X-Request-Id": "hello-world" },
        })
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Request-Id")).toBe("hello-world");
      expect(await res.text()).toBe("Spectra!");
    });
  });

  describe("Custom generator", () => {
    const app = new Spectra();

    app.use(
      requestId({
        generator: (c) => {
          const expected = c.req.header("X-Expected");
          return expected || "-";
        },
      })
    );
    app.get("/", (c) => c.text("Spectra!"));

    test("Should generate request id", async () => {
      const res = await app.fetch(
        new Request("http://localhost/", { headers: { "X-Expected": "foo" } })
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Request-Id")).toBe("foo");
      expect(await res.text()).toBe("Spectra!");
    });

    test("Should return expected request id", async () => {
      const res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Request-Id")).toBe("-");
      expect(await res.text()).toBe("Spectra!");
    });

    test("Should return existing request id", async () => {
      const res = await app.fetch(
        new Request("http://localhost/", {
          headers: { "X-Request-Id": "hello-world" },
        })
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Request-Id")).toBe("hello-world");
      expect(await res.text()).toBe("Spectra!");
    });
  });

  describe("Custom header name", () => {
    const app = new Spectra();

    app.use(requestId({ headerName: "X-Req-Id" }));
    app.get("/", (c) => c.text("Spectra!"));

    test("Should generate request id", async () => {
      const res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Req-Id")).toMatch(regexUUID);
      expect(await res.text()).toBe("Spectra!");
    });

    test("Should return existing request id", async () => {
      const res = await app.fetch(
        new Request("http://localhost/", {
          headers: { "X-Req-Id": "hello-world" },
        })
      );
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Req-Id")).toBe("hello-world");
      expect(await res.text()).toBe("Spectra!");
    });
  });
});
