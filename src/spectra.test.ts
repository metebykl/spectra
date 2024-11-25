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
