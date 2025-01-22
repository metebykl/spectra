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

  test("Nested routes", async () => {
    const app = new Spectra();

    const api = app.basePath("/api");
    api.get("/", (c) => c.text("GET /api"));
    api.post("/", (c) => c.text("POST /api"));
    api.get("/:id", (c) => c.text(`GET /api/${c.req.param("id")}`));

    app.get("/", (c) => c.text("GET /"));

    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("GET /");

    res = await app.fetch(new Request("http://localhost/api"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("GET /api");

    res = await app.fetch(
      new Request("http://localhost/api", { method: "POST" })
    );
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("POST /api");

    res = await app.fetch(new Request("http://localhost/api/1"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("GET /api/1");
  });

  test("Mounting", async () => {
    const app = new Spectra();
    app.get("/", (c) => c.text("GET /"));

    const api = new Spectra();
    api.get("/", (c) => c.text("GET /api"));
    api.post("/", (c) => c.text("POST /api"));
    api.get("/:id", (c) => c.text(`GET /api/${c.req.param("id")}`));

    app.route("/api", api);

    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("GET /");

    res = await app.fetch(new Request("http://localhost/api"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("GET /api");

    res = await app.fetch(
      new Request("http://localhost/api", { method: "POST" })
    );
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("POST /api");

    res = await app.fetch(new Request("http://localhost/api/1"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("GET /api/1");
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

  describe("Multiple Handlers", () => {
    const app = new Spectra();

    app.get(
      "/",
      async (c, next) => {
        c.header("X-Test", "foo");
        await next();
      },
      (c) => {
        return c.text("Spectra");
      }
    );

    test("Should execute middleware and return response", async () => {
      const res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("Spectra");
      expect(res.headers.get("X-Test")).toBe("foo");
    });
  });
});

describe("Error Handler", () => {
  describe("Basic", () => {
    const app = new Spectra();

    app.get("/", () => {
      throw new Error("Handler Error");
    });

    app.use("/middleware", () => {
      throw new Error("Middleware Error");
    });

    test("Should return default error message", async () => {
      let res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(500);
      expect(await res.text()).toBe("Internal Server Error");

      res = await app.fetch(new Request("http://localhost/middleware"));
      expect(res.status).toBe(500);
      expect(await res.text()).toBe("Internal Server Error");
    });
  });

  describe("Custom Handler", () => {
    const app = new Spectra();

    app.get("/", () => {
      throw new Error("Handler Error");
    });

    app.use("/middleware", () => {
      throw new Error("Middleware Error");
    });

    app.onError((c, err) => {
      c.header("X-Error", err.message);
      return c.text("Custom Message", 500);
    });

    test("Should return custom error message", async () => {
      let res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(500);
      expect(res.headers.get("X-Error")).toBe("Handler Error");
      expect(await res.text()).toBe("Custom Message");

      res = await app.fetch(new Request("http://localhost/middleware"));
      expect(res.status).toBe(500);
      expect(res.headers.get("X-Error")).toBe("Middleware Error");
      expect(await res.text()).toBe("Custom Message");
    });
  });

  describe("Custom Handler Async", () => {
    const app = new Spectra();

    app.get("/", () => {
      throw new Error("Handler Error");
    });

    app.use("/middleware", () => {
      throw new Error("Middleware Error");
    });

    app.onError(async (c, err) => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      c.header("X-Error", err.message);
      return c.text("Custom Message", 500);
    });

    test("Should return custom error message", async () => {
      let res = await app.fetch(new Request("http://localhost/"));
      expect(res.status).toBe(500);
      expect(res.headers.get("X-Error")).toBe("Handler Error");
      expect(await res.text()).toBe("Custom Message");

      res = await app.fetch(new Request("http://localhost/middleware"));
      expect(res.status).toBe(500);
      expect(res.headers.get("X-Error")).toBe("Middleware Error");
      expect(await res.text()).toBe("Custom Message");
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
