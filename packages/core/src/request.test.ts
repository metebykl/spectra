import { describe, test, expect } from "vitest";
import { Spectra } from "./spectra";
import { SpectraRequest } from "./request";

describe("Headers", () => {
  test("req.header() - get all", () => {
    const request = new Request("http://localhost/", {
      headers: { "X-Message": "Spectra" },
    });
    const req = new SpectraRequest(request, {});

    expect(req.header()).toEqual({ "x-message": "Spectra" });
  });

  test("req.header() - get by name", () => {
    const request = new Request("http://localhost/", {
      headers: { "X-Message": "Spectra" },
    });
    const req = new SpectraRequest(request, {});

    expect(req.header("X-Message")).toBe("Spectra");
  });

  test("Header name is case-insensitive", () => {
    const request = new Request("http://localhost/", {
      headers: {
        "Content-Type": "text/plain",
        lowercase: "value",
      },
    });
    const req = new SpectraRequest(request, {});
    expect(req.header("Content-Type")).toBe("text/plain");
    expect(req.header("LowerCase")).toBe("value");
  });
});

describe("Path parameters", () => {
  const app = new Spectra();

  test("req.param()", () => {
    app.get("/users/:id", (c) => {
      const id = c.req.param("id");
      expect(id).toBe("1");

      return c.text("OK");
    });

    app.fetch(new Request("http://localhost/users/1"));
  });

  test("req.params()", () => {
    app.get("/users/:userId/posts/:postId", (c) => {
      const params = c.req.params();

      const expected = {
        userId: "1",
        postId: "2",
      };
      expect(params).toEqual(expected);

      return c.text("OK");
    });

    app.fetch(new Request("http://localhost/users/1/posts/2"));
  });
});

describe("Query parameters", () => {
  test("req.query()", () => {
    const request = new Request("http://localhost?foo=bar&page=1");
    const req = new SpectraRequest(request, {});

    const query = req.query();
    const expected = {
      foo: "bar",
      page: "1",
    };
    expect(query).toEqual(expected);
  });

  test("req.query(param)", () => {
    const request = new Request("http://localhost?foo=bar");
    const req = new SpectraRequest(request, {});

    const foo = req.query("foo");
    expect(foo).toBe("bar");
  });

  test("req.queries()", () => {
    const request = new Request(
      "http://localhost?foo=bar&foo=baz&page=1&page=2"
    );
    const req = new SpectraRequest(request, {});

    const queries = req.queries();
    const expected = {
      foo: ["bar", "baz"],
      page: ["1", "2"],
    };
    expect(queries).toEqual(expected);
  });

  test("req.queries(param)", () => {
    const request = new Request("http://localhost?page=1&page=2");
    const req = new SpectraRequest(request, {});

    const queries = req.queries("page");
    expect(queries).toEqual(["1", "2"]);
  });
});

describe("Body parsing", () => {
  test("req.json()", async () => {
    const req = new SpectraRequest(
      new Request("http://localhost/", {
        method: "POST",
        body: '{"foo":"bar"}',
      }),
      {}
    );

    expect(await req.json()).toEqual({ foo: "bar" });
  });

  test("req.text()", async () => {
    const req = new SpectraRequest(
      new Request("http://localhost/", {
        method: "POST",
        body: '{"foo":"bar"}',
      }),
      {}
    );

    expect(await req.text()).toBe('{"foo":"bar"}');
  });

  test("req.arrayBuffer()", async () => {
    const buf = new TextEncoder().encode('{"foo":"bar"}').buffer;
    const req = new SpectraRequest(
      new Request("http://localhost/", {
        method: "POST",
        body: buf,
      }),
      {}
    );

    expect(await req.arrayBuffer()).toEqual(buf);
  });

  test("req.formData()", async () => {
    const formData = new FormData();
    formData.append("foo", "bar");

    const req = new SpectraRequest(
      new Request("http://localhost/", {
        method: "POST",
        body: formData,
      }),
      {}
    );

    expect((await req.formData()).get("foo")).toBe("bar");
  });

  test("req.blob()", async () => {
    const blob = new Blob(['{"foo":"bar"}'], { type: "application/json" });
    const req = new SpectraRequest(
      new Request("http://localhost/", {
        method: "POST",
        body: blob,
      }),
      {}
    );

    expect(await req.blob()).toEqual(blob);
  });
});
