import { describe, test, expect } from "vitest";
import { timeout } from ".";
import { Spectra } from "../../spectra";

describe("Timeout Middleware", () => {
  test("Default handler", async () => {
    const app = new Spectra();

    app.use(timeout({ duration: 100 }));

    app.get("/normal", (c) => c.text("Test"));
    app.get("/slow", async (c) => {
      await new Promise((resolve) => setTimeout(resolve, 125));
      return c.text("Test");
    });

    const normal = await app.fetch(new Request("http://localhost/normal"));
    expect(normal.status).toBe(200);
    expect(await normal.text()).toBe("Test");

    const slow = await app.fetch(new Request("http://localhost/slow"));
    expect(slow.status).toBe(504);
    expect(await slow.text()).toBe("Gateway Timeout");
  });

  test("Custom handler", async () => {
    const app = new Spectra();

    app.use(
      timeout({
        duration: 100,
        handler: (c) => c.json({ error: "Gateway Timeout" }, 504),
      })
    );

    app.get("/normal", (c) => c.text("Test"));
    app.get("/slow", async (c) => {
      await new Promise((resolve) => setTimeout(resolve, 125));
      return c.text("Test");
    });

    const normal = await app.fetch(new Request("http://localhost/normal"));
    expect(normal.status).toBe(200);
    expect(await normal.text()).toBe("Test");

    const slow = await app.fetch(new Request("http://localhost/slow"));
    expect(slow.status).toBe(504);
    expect(await slow.json()).toEqual({ error: "Gateway Timeout" });
  });
});
