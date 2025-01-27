import { describe, test, expect } from "vitest";
import { Spectra } from "@spectrajs/core";
import { addToDocs, generateSpecs, swaggerUI } from "../src";

const req = (path: string) => new Request(`http://localhost${path}`);

describe("OpenAPI", () => {
  describe("generateSpecs", () => {
    test("Example app", () => {
      const app = new Spectra();

      app.get(
        "/api/users/:userId",
        addToDocs({
          description: "Get user information",
          parameters: [
            {
              name: "userId",
              in: "path",
              schema: {},
              required: true,
            },
          ],
          responses: { 200: { description: "Success" } },
          tags: ["users"],
        }),
        (c) => c.json({ userId: c.req.param("userId") })
      );

      const specs = generateSpecs(app);

      expect(specs.openapi).toBe("3.0.3");
      expect(specs.info).toEqual({
        title: "Spectra Documentation",
        version: "0.0.0",
      });
      expect(specs.paths).toEqual({
        "/api/users/{userId}": {
          get: {
            description: "Get user information",
            parameters: [
              {
                name: "userId",
                in: "path",
                schema: {},
                required: true,
              },
            ],
            responses: { 200: { description: "Success" } },
            tags: ["users"],
          },
        },
      });
    });
  });
});

describe("SwaggerUI Middleware", async () => {
  test("Basic", async () => {
    const app = new Spectra();
    app.use(
      "/swagger",
      swaggerUI({ url: "https://petstore3.swagger.io/api/v3/openapi.json" })
    );

    const res = await app.fetch(req("/swagger"));
    expect(res.headers.get("Content-Type")).toBe("text/html; charset=UTF-8");
    expect(res.status).toBe(200);
  });

  test("Custom title", async () => {
    const app = new Spectra();
    app.use(
      "/swagger",
      swaggerUI({
        title: "Documentation",
        url: "https://petstore3.swagger.io/api/v3/openapi.json",
      })
    );

    const res = await app.fetch(req("/swagger"));
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html.includes("<title>Documentation</title>")).toBe(true);
  });

  test("Custom version", async () => {
    const app = new Spectra();
    app.use(
      "/swagger",
      swaggerUI({
        version: "5.17.0",
        url: "https://petstore3.swagger.io/api/v3/openapi.json",
      })
    );

    const res = await app.fetch(req("/swagger"));
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(
      html.includes(
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.0/swagger-ui-bundle.js"
      )
    ).toBe(true);
  });
});
