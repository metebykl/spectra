import { describe, test, expect } from "vitest";
import request from "supertest";
import { Spectra } from "@spectrajs/core";
import { createAdapter, serve } from "../src";

describe("Basic", () => {
  const app = new Spectra()
    .get("/", (c) => {
      return c.text("Hello World!");
    })
    .get("/user-agent", (c) => {
      return c.text(c.req.header("User-Agent") as string);
    })
    .get("/redirect", (c) => {
      return c.redirect("/");
    })
    .post("/posts/:id", (c) => {
      const { id } = c.req.params();
      return c.json({ id: parseInt(id) });
    })
    .delete("/posts/:id", (c) => {
      const { id } = c.req.params();
      return c.json({ id: parseInt(id) });
    })
    .get("/error", () => {
      throw new Error("Failed");
    });

  const server = createAdapter(app);

  test("Should return response 200 - GET /", async () => {
    const res = await request(server).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("text/plain");
    expect(res.text).toBe("Hello World!");
  });

  test("Should return response 200 - GET /user-agent", async () => {
    const res = await request(server)
      .get("/user-agent")
      .set("User-Agent", "Test/Spectra");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("text/plain");
    expect(res.text).toBe("Test/Spectra");
  });

  test("Should return response 302 - GET /redirect", async () => {
    const res = await request(server).get("/redirect");
    expect(res.status).toBe(302);
    expect(res.headers["location"]).toBe("/");
  });

  test("Should return response 200 - POST /posts/123", async () => {
    const res = await request(server).post("/posts/123");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/json");
    expect(res.text).toBe('{"id":123}');
  });

  test("Should return response 200 - DELETE /posts/123", async () => {
    const res = await request(server).delete("/posts/123");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/json");
    expect(res.text).toBe('{"id":123}');
  });

  test("Should return response 500 - GET /error", async () => {
    const res = await request(server).get("/error");
    expect(res.status).toBe(500);
    expect(res.headers["content-type"]).toBe("text/plain");
  });
});

describe("Serve", () => {
  describe("Default port", () => {
    const app = new Spectra();

    app.get("/", (c) => c.text("Spectra!"));
    serve(app);

    test("Should serve on port 8282", async () => {
      const res = await fetch("http://localhost:8282");
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Spectra!");
    });
  });

  describe("Custom port", () => {
    const app = new Spectra();

    app.get("/", (c) => c.text("Spectra!"));
    serve({ fetch: app.fetch, port: 3000 });

    test("Should serve on port 3000", async () => {
      const res = await fetch("http://localhost:3000");
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Spectra!");
    });
  });
});
