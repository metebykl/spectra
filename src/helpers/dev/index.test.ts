import { describe, test, expect, beforeEach } from "vitest";
import { Spectra } from "../../spectra";
import { getRoutes, listRoutes } from ".";

describe("Dev Helper", () => {
  const app = new Spectra()
    .use("*", (c, next) => next())
    .get("/", (c) => c.text("Ok"))
    .get("/api/*", (c) => c.text("Ok"))
    .post("/", (c) => c.text("Ok"))
    .patch("/", (c) => c.text("Ok"))
    .delete("/", (c) => c.text("Ok"));

  test("getRoutes()", () => {
    const routes = getRoutes(app);
    expect(routes).toEqual([
      { path: "/*", method: "ALL", tag: "[middleware]", isMiddleware: true },
      { path: "/", method: "GET", tag: "[handler]", isMiddleware: false },
      { path: "/api/*", method: "GET", tag: "[handler]", isMiddleware: false },
      { path: "/", method: "POST", tag: "[handler]", isMiddleware: false },
      { path: "/", method: "PATCH", tag: "[handler]", isMiddleware: false },
      { path: "/", method: "DELETE", tag: "[handler]", isMiddleware: false },
    ]);
  });

  describe("listRoutes()", () => {
    let logs: string[] = [];

    beforeEach(() => {
      logs = [];
      console.log = (...data) => logs.push(...data);
    });

    test("With default options", () => {
      listRoutes(app);
      expect(logs).toEqual([
        "GET /",
        "GET /api/*",
        "POST /",
        "PATCH /",
        "DELETE /",
      ]);
    });

    test("Verbose", () => {
      listRoutes(app, { verbose: true });
      expect(logs).toEqual([
        "ALL /* [middleware]",
        "GET / [handler]",
        "GET /api/* [handler]",
        "POST / [handler]",
        "PATCH / [handler]",
        "DELETE / [handler]",
      ]);
    });

    test("Colorized", () => {
      listRoutes(app, { colorize: true });
      expect(logs).toEqual([
        "\x1b[32mGET\x1b[0m /",
        "\x1b[32mGET\x1b[0m /api/*",
        "\x1b[32mPOST\x1b[0m /",
        "\x1b[32mPATCH\x1b[0m /",
        "\x1b[32mDELETE\x1b[0m /",
      ]);
    });

    test("Verbose and colorized", () => {
      listRoutes(app, { verbose: true, colorize: true });
      expect(logs).toEqual([
        "\x1b[32mALL\x1b[0m /* [middleware]",
        "\x1b[32mGET\x1b[0m / [handler]",
        "\x1b[32mGET\x1b[0m /api/* [handler]",
        "\x1b[32mPOST\x1b[0m / [handler]",
        "\x1b[32mPATCH\x1b[0m / [handler]",
        "\x1b[32mDELETE\x1b[0m / [handler]",
      ]);
    });
  });
});
