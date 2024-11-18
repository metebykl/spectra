import { describe, test, expect, beforeEach } from "vitest";
import { logger } from ".";
import { Spectra } from "../../spectra";

describe("Logger Middleware", () => {
  let app: Spectra;
  let log: string;

  beforeEach(() => {
    app = new Spectra();

    const fn = (str: string) => {
      log = str;
    };

    app.use(logger({ fn }));

    app.get("/", (c) => c.text("OK"));
  });

  test("Log status 200", async () => {
    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(log).toBe("GET /");
  });
});
