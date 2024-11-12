import { describe, test, expect } from "vitest";
import { Context } from "./context";

describe("Context", () => {
  const request = new Request("http://localhost/");

  test("c.status()", () => {
    const c = new Context(request, {});
    c.status(201);

    const response = c.text("Message");
    expect(response.status).toBe(201);
  });

  test("c.text()", async () => {
    const c = new Context(request, {});
    const response = c.text("Hello World!");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(await response.text()).toBe("Hello World!");
  });

  test("c.text() with status", async () => {
    const c = new Context(request, {});
    const response = c.text("Hello World!", 201);

    expect(response.status).toBe(201);
    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(await response.text()).toBe("Hello World!");
  });

  test("c.json()", async () => {
    const c = new Context(request, {});
    const response = c.json({ message: "Hello" });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(await response.text()).toBe('{"message":"Hello"}');
  });

  test("c.html()", async () => {
    const c = new Context(request, {});
    const response = c.html("<h1>Example</h1>");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/html");
    expect(await response.text()).toBe("<h1>Example</h1>");
  });

  test("c.redirect()", () => {
    const c = new Context(request, {});
    const response = c.redirect("https://example.com");

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("https://example.com");
  });

  test("c.set() and c.get()", () => {
    const c = new Context(request, {});
    c.set("foo", "bar");

    expect(c.get("foo")).toBe("bar");
    expect(c.get("other")).toBe(undefined);
  });

  test("c.set() and c.get() object", () => {
    const c = new Context(request, {});
    c.set("user", { id: 1, name: "John" });

    expect(c.get("user")).toEqual({ id: 1, name: "John" });
  });

  test("c.notFound()", async () => {
    const notFoundHandler = (): Response => new Response(null, { status: 404 });
    const c = new Context(request, {}, { notFoundHandler });

    const res = await c.notFound();
    expect(res.status).toBe(404);
  });
});
