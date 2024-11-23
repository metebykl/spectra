import { describe, test, expect } from "vitest";
import { Spectra } from "./spectra";
import { poweredBy } from "./middleware";

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
