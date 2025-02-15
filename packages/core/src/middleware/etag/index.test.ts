import { describe, test, expect } from "vitest";
import { etag } from ".";
import { Spectra } from "../../spectra";

describe("ETag Middleware", () => {
  test("Should return etag header", async () => {
    const app = new Spectra();

    app.use(etag());
    app.get("/foo", (c) => c.text("foo"));
    app.get("/bar", (c) => c.text("bar"));

    let res = await app.fetch(new Request("http://localhost/foo"));
    expect(res.headers.get("ETag")).toBe(
      '"0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33"'
    );

    res = await app.fetch(new Request("http://localhost/bar"));
    expect(res.headers.get("ETag")).toBe(
      '"62cdb7020ff920e5aa642c3d4066950dd1f01f4d"'
    );
  });

  test("Should return weak etag header", async () => {
    const app = new Spectra();

    app.use(etag({ weak: true }));
    app.get("/foo", (c) => c.text("foo"));
    app.get("/bar", (c) => c.text("bar"));

    let res = await app.fetch(new Request("http://localhost/foo"));
    expect(res.headers.get("ETag")).toBe(
      'W/"0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33"'
    );

    res = await app.fetch(new Request("http://localhost/bar"));
    expect(res.headers.get("ETag")).toBe(
      'W/"62cdb7020ff920e5aa642c3d4066950dd1f01f4d"'
    );
  });

  test("Should return etag header - ReadableStream", async () => {
    const app = new Spectra();

    app.use(etag());
    app.get("/", (c) => {
      return c.body(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new Uint8Array([1]));
            controller.enqueue(new Uint8Array([2]));
            controller.close();
          },
        })
      );
    });

    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.headers.get("ETag")).toBe(
      '"f83d52b40babf1a7192ea8e8520f57b5b7e0e98f"'
    );
  });

  test("Should return etag header - ArrayBuffer", async () => {
    const app = new Spectra();

    app.use(etag());
    app.get("/", (c) => {
      return c.body(new ArrayBuffer(8));
    });

    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.headers.get("ETag")).toBe(
      '"05fe405753166f125559e7c9ac558654f107c7e9"'
    );
  });

  test("Should return etag header with custom hashFn", async () => {
    const app = new Spectra();

    app.use(
      etag({
        hashFn: (body) => crypto.subtle.digest({ name: "SHA-256" }, body),
      })
    );
    app.get("/foo", (c) => c.text("foo"));
    app.get("/bar", (c) => c.text("bar"));

    let res = await app.fetch(new Request("http://localhost/foo"));
    expect(res.headers.get("ETag")).toBe(
      '"2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"'
    );

    res = await app.fetch(new Request("http://localhost/bar"));
    expect(res.headers.get("ETag")).toBe(
      '"fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9"'
    );
  });

  test("Should not return etag header when the stream is empty", async () => {
    const app = new Spectra();

    app.use(etag());
    app.get("/", (c) => {
      return c.body(
        new ReadableStream({
          start(controller) {
            controller.close();
          },
        })
      );
    });

    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.headers.get("ETag")).toBeNull();
  });

  test("Should not return etag header when body is null", async () => {
    const app = new Spectra();

    app.use(etag());
    app.get("/", (c) => c.body(null));

    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.headers.get("ETag")).toBeNull();
  });

  test("Should not override etag header from handler", async () => {
    const app = new Spectra();

    app.use(etag());
    app.get("/", (c) => {
      c.header("ETag", '"custom"');
      return c.text("Spectra");
    });

    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.headers.get("ETag")).toBe('"custom"');
  });

  test("Conditional requests", async () => {
    const app = new Spectra();

    app.use(etag());
    app.get("/", () => {
      return new Response("Spectra", {
        headers: {
          "Cache-Control": "public, max-age=180",
          Vary: "Accept",
        },
      });
    });

    // unconditional request
    let res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Spectra");
    expect(res.headers.get("ETag")).not.toBeNull();
    const etagValue = res.headers.get("ETag") ?? "";

    // conditional request with wrong ETag
    res = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          "If-None-Match": '"random"',
        },
      })
    );
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Spectra");
    expect(res.headers.get("ETag")).not.toBeNull();

    // conditional request with matching ETag
    res = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          "If-None-Match": etagValue,
        },
      })
    );
    expect(res.status).toBe(304);
    expect(await res.text()).toBe("");
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=180");
    expect(res.headers.get("Vary")).toBe("Accept");

    // conditional request with matching ETag (multiple)
    res = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          "If-None-Match": `${etagValue}, "random"`,
        },
      })
    );
    expect(res.status).toBe(304);
  });

  test("Should only preserve allowed headers", async () => {
    const app = new Spectra();

    app.use(etag());
    app.get("/", () => {
      return new Response("Spectra", {
        headers: {
          "Cache-Control": "public, max-age=180",
          "X-Message": "test",
        },
      });
    });

    const res = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          "If-None-Match": `"d99a69e969d1c24f294f8a8fddf071f104cbc47f"`,
        },
      })
    );
    expect(res.status).toBe(304);
    expect(res.headers.get("ETag")).toBe(
      '"d99a69e969d1c24f294f8a8fddf071f104cbc47f"'
    );
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=180");
    expect(res.headers.get("X-Message")).toBeFalsy();
  });
});
