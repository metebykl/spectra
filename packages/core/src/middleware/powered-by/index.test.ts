import { describe, test, expect } from "vitest";
import { poweredBy } from ".";
import { Spectra } from "../../spectra";

describe("Powered-by Middleware", () => {
  test("Should return default X-Powered-By header", async () => {
    const app = new Spectra();

    app.use(poweredBy());
    app.get("/", (c) => c.text("OK"));

    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.headers.get("X-Powered-By")).toBe("Spectra");
  });

  test("Should return custom X-Powered-By header", async () => {
    const app = new Spectra();

    app.use(poweredBy({ serverName: "Test" }));
    app.get("/", (c) => c.text("OK"));

    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.headers.get("X-Powered-By")).toBe("Test");
  });
});
