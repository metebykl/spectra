import { describe, test, expect } from "vitest";
import { cors } from ".";
import { Spectra } from "../../spectra";

describe("CORS Middleware", () => {
  const app = new Spectra();

  app.use("/cors/*", cors());
  app.use(
    "/cors2/*",
    cors({
      origin: "http://example.com",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["X-Message"],
      exposeHeaders: ["Content-Length"],
      maxAge: 200,
      credentials: true,
    })
  );

  app.get("/cors/foo", (c) => c.text("Ok"));
  app.get("/cors2/foo", (c) => c.text("Ok"));

  test("GET with default options", async () => {
    const res = await app.fetch(new Request("http://localhost/cors/foo"));

    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Vary")).toBeNull();
  });

  test("Preflight with default options", async () => {
    const req = new Request("http://localhost/cors/foo", {
      method: "OPTIONS",
      headers: { "Access-Control-Request-Headers": "Content-Type" },
    });
    const res = await app.fetch(req);

    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(
      res.headers.get("Access-Control-Allow-Methods")?.split(/\s*,\s*/)
    ).toEqual(["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]);

    expect(res.headers.get("Access-Control-Allow-Headers")).toBe("*");
    expect(res.headers.get("Access-Control-Expose-Headers")).toBe("*");
  });

  test("Preflight with options", async () => {
    const req = new Request("http://localhost/cors2/foo", {
      method: "OPTIONS",
      headers: { origin: "http://example.com" },
    });

    const res = await app.fetch(req);

    expect(res.status).toBe(204);

    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://example.com"
    );
    expect(res.headers.get("Vary")?.split(/\s*,\s*/)).toEqual(
      expect.arrayContaining(["Origin"])
    );

    expect(
      res.headers.get("Access-Control-Allow-Methods")?.split(/\s*,\s*/)
    ).toEqual(["GET", "POST", "OPTIONS"]);

    expect(
      res.headers.get("Access-Control-Allow-Headers")?.split(/\s*,\s*/)
    ).toEqual(["X-Message"]);
    expect(
      res.headers.get("Access-Control-Expose-Headers")?.split(/\s*,\s*/)
    ).toEqual(["Content-Length"]);

    expect(res.headers.get("Access-Control-Max-Age")).toBe("200");
    expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
  });

  test("Should not allow unmatched origin", async () => {
    const req = new Request("https://localhost/cors2/foo", {
      method: "OPTIONS",
      headers: { origin: "http://example.dev" },
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(204);
    expect(res.headers.has("Access-Control-Allow-Origin")).toBe(false);
  });

  test("Should not modify existing Vary header", async () => {
    const res = await app.fetch(
      new Request("http://localhost/cors2/foo", {
        headers: {
          vary: "accept-encoding",
          origin: "http://example.com",
        },
      })
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://example.com"
    );
    expect(res.headers.get("Vary")?.split(/\s*,\s*/)).toEqual(
      expect.arrayContaining(["accept-encoding"])
    );
  });
});
