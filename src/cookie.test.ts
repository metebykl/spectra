import { describe, test, expect } from "vitest";
import { Spectra } from "./spectra";
import { getCookie } from "./cookie";

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
