import { describe, expect, test, vi } from "vitest";
import { Spectra, type Context } from "@spectrajs/core";
import { describeRoute, generateSpecs, openAPISpecs, swaggerUI } from "../src";

const req = (path: string) => new Request(`http://localhost${path}`);

describe("OpenAPI", () => {
  describe("generateSpecs", () => {
    test("Example app", () => {
      const app = new Spectra();

      app.get(
        "/api/users/:userId",
        describeRoute({
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

    test("Exclude paths", () => {
      const app = new Spectra();

      app.get(
        "/api/users",
        describeRoute({
          description: "Get all users",
          responses: { 200: { description: "Success" } },
        }),
        (c) => c.json([])
      );

      app.get(
        "/api/users/:userId",
        describeRoute({
          description: "Get user information",
          responses: { 200: { description: "Success" } },
        }),
        (c) => c.json({ userId: c.req.param("userId") })
      );

      const specs = generateSpecs(app, { exclude: ["/api/users/{userId}"] });

      expect(specs.paths["/api/users"]).toEqual({
        get: {
          description: "Get all users",
          responses: { 200: { description: "Success" } },
        },
      });
      expect(specs.paths["/api/users/{userId}"]).toBeFalsy();
    });

    test("Exclude methods", () => {
      const app = new Spectra();

      app.get(
        "/api/users",
        describeRoute({
          description: "Get all users",
          responses: { 200: { description: "Success" } },
        }),
        (c) => c.json([])
      );

      app.put(
        "/api/users/:userId",
        describeRoute({
          description: "Create or update user information",
          responses: { 200: { description: "Success" } },
        }),
        (c) => c.json({ userId: c.req.param("userId") })
      );

      const specs = generateSpecs(app, { excludeMethods: ["PUT"] });

      expect(specs.paths["/api/users"]).toEqual({
        get: {
          description: "Get all users",
          responses: { 200: { description: "Success" } },
        },
      });
      expect(specs.paths["/api/users/{userId}"]).toBeFalsy();
    });

    test("Exclude tags", () => {
      const app = new Spectra();
      const specs = generateSpecs(app, {
        documentation: { tags: [{ name: "posts" }, { name: "users" }] },
        excludeTags: ["users"],
      });
      expect(specs.tags).toEqual([{ name: "posts" }]);
    });

    test("Allowed methods", () => {
      const app = new Spectra();
      app.get(
        "/",
        describeRoute({
          responses: { 200: { description: "Success" } },
        }),
        (c) => c.text("GET")
      );
      app.connect(
        "/",
        describeRoute({
          responses: { 200: { description: "Success" } },
        }),
        (c) => c.text("CONNECT")
      );

      const specs = generateSpecs(app);

      expect(specs.paths["/"]["get"]).toEqual({
        responses: { 200: { description: "Success" } },
      });
      expect(specs.paths["/"]["connect"]).toBeFalsy();
    });
  });

  describe("openAPISpecs", () => {
    test("Should return correct specs", async () => {
      const app = new Spectra();
      app.use("/openapi", openAPISpecs(app));
      app.get(
        "/api/posts",
        describeRoute({
          description: "Get all posts",
          responses: { 200: { description: "Success" } },
        }),
        (c) => c.json([])
      );

      const res = await app.fetch(req("/openapi"));
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe(
        "application/json; charset=UTF-8"
      );
      expect(await res.json()).toEqual({
        info: {
          title: "Spectra Documentation",
          version: "0.0.0",
        },
        openapi: "3.0.3",
        paths: {
          "/api/posts": {
            get: {
              description: "Get all posts",
              responses: {
                "200": {
                  description: "Success",
                },
              },
            },
          },
        },
      });
    });
  });

  describe("describeRoute", () => {
    test("Should call next()", async () => {
      const next = vi.fn();
      const middleware = describeRoute({ responses: [] });
      await middleware({} as Context, next);
      expect(next).toHaveBeenCalled();
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
