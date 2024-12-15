import { describe, test, expect } from "vitest";
import { Spectra } from "./spectra";
import { poweredBy } from "./middleware";

describe("Routing", () => {
  test("Base path", async () => {
    const app = new Spectra("/api");

    app.get("/", (c) => c.json({ message: "Test" }));

    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(404);

    res = await app.fetch(new Request("http://localhost/api"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Test" });
  });

  test("Chaining", async () => {
    const app = new Spectra();

    let app2 = app.use("/", async (_, next) => {
      await next();
    });
    expect(app2).not.toBeUndefined();

    app2 = app.get("/", (c) => c.text("Spectra"));
    expect(app2).not.toBeUndefined();

    app2 = app.notFound((c) => c.text("Not Found", 404));
    expect(app2).not.toBeUndefined();

    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Spectra");

    res = await app2.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Spectra");
  });

  test("Wildcards", async () => {
    const app = new Spectra();

    app.get("/foo/*", (c) => c.text("Hello World!"));

    let res = await app.fetch(new Request("http://localhost/foo/bar"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello World!");

    res = await app.fetch(new Request("http://localhost/foo"));
    expect(res.status).toBe(404);
  });

  describe("Path Parameters", () => {
    const app = new Spectra();

    app.get("/posts/:postId", (c) => {
      const { postId } = c.req.params();
      return c.json({ id: postId });
    });

    app.get("/users/:userId/posts/:postId", (c) => {
      const { userId, postId } = c.req.params();
      return c.json({ userId, postId });
    });

    test("Should parse single path parameter", async () => {
      let res = await app.fetch(new Request("http://localhost/posts/1"));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ id: "1" });

      res = await app.fetch(new Request("http://localhost/posts"));
      expect(res.status).toBe(404);
    });

    test("Should parse multiple path parameters", async () => {
      const res = await app.fetch(
        new Request("http://localhost/users/1/posts/2")
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ userId: "1", postId: "2" });
    });
  });
});

describe("Not Found", () => {
  const app = new Spectra();

  app.get("/", (c) => c.text("Hello"));

  test("No route found", async () => {
    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello");

    res = await app.fetch(new Request("http://localhost/foo"));
    expect(res.status).toBe(404);
    expect(await res.text()).toBe("404 Not Found");
  });

  test("With middleware", async () => {
    const app = new Spectra();

    app.use(poweredBy());

    app.get("/", (c) => c.text("Hello"));

    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello");

    res = await app.fetch(new Request("http://localhost/foo"));
    expect(res.status).toBe(404);
    expect(await res.text()).toBe("404 Not Found");
  });

  test("Custom handler", async () => {
    const app = new Spectra();

    app.notFound((c) => c.json({ error: "Not Found" }, 404));

    app.get("/", (c) => c.text("Hello"));

    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello");

    res = await app.fetch(new Request("http://localhost/foo"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not Found" });
  });
});

describe("Middleware", () => {
  describe("Basic", () => {
    const app = new Spectra();

    app.use(async (c, next) => {
      await next();
      c.res.headers.set("X-Custom", "Spectra");
    });

    app.get("/", (c) => c.text("Hello World!"));

    test("Should return correct headers", async () => {
      const res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Custom")).toBe("Spectra");
      expect(await res.text()).toBe("Hello World!");
    });

    test("Should return not found", async () => {
      const res = await app.fetch(new Request("http://localhost/foo"));
      expect(res.status).toBe(404);
    });
  });

  describe("With path", () => {
    const app = new Spectra();

    app.use("/api/*", async (c, next) => {
      await next();
      c.res.headers.set("X-Custom", "Spectra");
    });

    app.get("/api/test", (c) => c.text("Hello World!"));

    test("Should return correct headers", async () => {
      const res = await app.fetch(new Request("http://localhost/api/test"));
      expect(res.status).toBe(200);
      expect(res.headers.get("X-Custom")).toBe("Spectra");
      expect(await res.text()).toBe("Hello World!");
    });

    test("Should return not found", async () => {
      const res = await app.fetch(new Request("http://localhost/foo"));
      expect(res.status).toBe(404);
    });
  });

  test("Overwrite response", async () => {
    const app = new Spectra();

    app.use("*", async (c, next) => {
      await next();
      c.res = new Response("Middleware", { status: 201 });
    });

    app.get("/", (c) => c.text("Hello"));

    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(201);
    expect(await res.text()).toBe("Middleware");

    // should overwrite if no handler is found too
    res = await app.fetch(new Request("http://localhost/foo"));
    expect(res.status).toBe(201);
    expect(await res.text()).toBe("Middleware");
  });

  test("Set response headers", async () => {
    const app = new Spectra();

    app.use("*", async (c, next) => {
      c.res.headers.set("X-Message", "Spectra");
      await next();
    });

    app.get("/", (c) => c.text("Hello"));

    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Message")).toBe("Spectra");
    expect(await res.text()).toBe("Hello");
  });
});
