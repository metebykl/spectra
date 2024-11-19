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
    app.get("/redirect", (c) => c.redirect("/other"));
    app.get("/empty", (c) => c.notFound());
    app.get("/error", (c) => c.text("Internal Server Error", 500));
  });

  test("Log status 200", async () => {
    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(log.startsWith("GET / \x1b[32m200\x1b[0m")).toBe(true);
  });

  test("Log status 302", async () => {
    const res = await app.fetch(new Request("http://localhost/redirect"));
    expect(res.status).toBe(302);
    expect(log.startsWith("GET /redirect \x1b[36m302\x1b[0m")).toBe(true);
  });

  test("Log status 404", async () => {
    const res = await app.fetch(new Request("http://localhost/empty"));
    expect(res.status).toBe(404);
    expect(log.startsWith("GET /empty \x1b[33m404\x1b[0m")).toBe(true);
  });

  test("Log status 500", async () => {
    const res = await app.fetch(new Request("http://localhost/error"));
    expect(res.status).toBe(500);
    expect(log.startsWith("GET /error \x1b[31m500\x1b[0m")).toBe(true);
  });
});

describe("Logger Middleware NO_COLOR", () => {
  let app: Spectra;
  let log: string;

  beforeEach(() => {
    app = new Spectra();

    const fn = (str: string) => {
      log = str;
    };

    app.use(logger({ fn, colorize: false }));

    app.get("/", (c) => c.text("OK"));
    app.get("/redirect", (c) => c.redirect("/other"));
    app.get("/empty", (c) => c.notFound());
    app.get("/error", (c) => c.text("Internal Server Error", 500));
  });

  test("Log status 200", async () => {
    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(log.startsWith("GET / 200")).toBe(true);
  });

  test("Log status 302", async () => {
    const res = await app.fetch(new Request("http://localhost/redirect"));
    expect(res.status).toBe(302);
    expect(log.startsWith("GET /redirect 302")).toBe(true);
  });

  test("Log status 404", async () => {
    const res = await app.fetch(new Request("http://localhost/empty"));
    expect(res.status).toBe(404);
    expect(log.startsWith("GET /empty 404")).toBe(true);
  });

  test("Log status 500", async () => {
    const res = await app.fetch(new Request("http://localhost/error"));
    expect(res.status).toBe(500);
    expect(log.startsWith("GET /error 500")).toBe(true);
  });
});
