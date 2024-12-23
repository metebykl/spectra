import { describe, test, expect } from "vitest";
import { Spectra } from "./spectra";
import { getCookie, setCookie } from "./cookie";

describe("Parse cookie", () => {
  const app = new Spectra();

  const request = new Request("http://localhost/");
  request.headers.set("Cookie", "foo=bar; hello=world");

  test("getCookie(name)", async () => {
    app.get("/", (c) => {
      const cookie = getCookie(c, "foo");
      c.header("X-Value", cookie);

      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("X-Value")).toBe("bar");
  });

  test("getCookie()", async () => {
    app.get("/", (c) => {
      const cookies = getCookie(c);
      return c.json(cookies);
    });

    const res = await app.fetch(request);
    const body = await res.json();

    expect(body).toEqual({ foo: "bar", hello: "world" });
  });
});

describe("Set cookie", () => {
  const app = new Spectra();
  const request = new Request("http://localhost/");

  test("Set single cookie", async () => {
    app.get("/", (c) => {
      setCookie(c, "foo", "bar");
      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("Set-Cookie")).toBe("foo=bar");
  });

  test("Set cookie Path", async () => {
    app.get("/", (c) => {
      setCookie(c, "foo", "bar", {
        path: "/",
      });

      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("Set-Cookie")).toBe(`foo=bar; Path=/`);
  });

  test("Set cookie SameSite", async () => {
    app.get("/", (c) => {
      setCookie(c, "foo", "bar", {
        sameSite: "Strict",
      });

      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("Set-Cookie")).toBe(`foo=bar; SameSite=Strict`);
  });

  test("Set cookie Expires", async () => {
    const expire = new Date(Date.now() + 1000 * 60);

    app.get("/", (c) => {
      setCookie(c, "foo", "bar", {
        expires: expire,
      });

      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("Set-Cookie")).toBe(
      `foo=bar; Expires=${expire.toUTCString()}`
    );
  });

  test("Set cookie MaxAge", async () => {
    app.get("/", (c) => {
      setCookie(c, "foo", "bar", {
        maxAge: 60 * 60,
      });

      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("Set-Cookie")).toBe(`foo=bar; Max-Age=3600`);
  });

  test("Set cookie HttpOnly", async () => {
    app.get("/", (c) => {
      setCookie(c, "foo", "bar", {
        httpOnly: true,
      });

      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("Set-Cookie")).toBe(`foo=bar; HttpOnly`);
  });

  test("Set multiple cookies", async () => {
    app.get("/", (c) => {
      setCookie(c, "foo", "bar");
      setCookie(c, "hello", "world");

      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("Set-Cookie")).toBe("foo=bar, hello=world");
  });

  test("Set multiple cookies with Path", async () => {
    app.get("/", (c) => {
      setCookie(c, "foo", "bar", { path: "/" });
      setCookie(c, "hello", "world", { path: "/test" });

      return c.text("OK");
    });

    const res = await app.fetch(request);
    expect(res.headers.get("Set-Cookie")).toBe(
      "foo=bar; Path=/, hello=world; Path=/test"
    );
  });
});
