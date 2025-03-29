import { describe, test, expect } from "vitest";
import { Spectra } from "./spectra";
import { validator } from "./validator";

describe("JSON", () => {
  const app = new Spectra();
  app.post(
    "/greet",
    validator("json", (value, c) => {
      const name = value["name"];
      if (!name || typeof name !== "string") {
        return c.text("Bad Request", 400);
      }
      return { name };
    }),
    (c) => {
      const { name } = c.req.valid<{ name: string }>("json");
      return c.json({ message: `Hi ${name}!` });
    }
  );

  test("Should return response 200 with valid data", async () => {
    const res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Spectra" }),
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hi Spectra!" });
  });

  test("Should return response 400", async () => {
    let res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: 1 }),
      })
    );
    expect(res.status).toBe(400);

    res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foo: "bar" }),
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("Malformed JSON request", () => {
  const app = new Spectra();
  app.post(
    "/post",
    validator("json", (value) => value),
    (c) => {
      return c.json(c.req.valid("json"));
    }
  );

  test("Should return response 400 if body is not a valid JSON", async () => {
    const res = await app.fetch(
      new Request("http://localhost/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{"foo": "bar}`,
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("FormData", () => {
  const app = new Spectra();
  app.post(
    "/greet",
    validator("form", (value) => value),
    (c) => {
      return c.json(c.req.valid("form"));
    }
  );

  test("Should return response 200 with valid data", async () => {
    const formData = new FormData();
    formData.append("name", "Spectra");
    const res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        body: formData,
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ name: "Spectra" });
  });

  test("Should return array if multiple values are appended", async () => {
    const formData = new FormData();
    formData.append("data", "foo");
    formData.append("data", "bar");
    formData.append("data", "baz");

    const res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        body: formData,
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: ["foo", "bar", "baz"] });
  });
});

describe("Malformed FormData request", () => {
  const app = new Spectra();
  app.post(
    "/post",
    validator("form", (value) => value),
    (c) => {
      return c.json(c.req.valid("form"));
    }
  );

  test("Should return response 400 for malformed content type", async () => {
    const res = await app.fetch(
      new Request("http://localhost/post", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: "foo",
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("Query", () => {
  const app = new Spectra();
  app.get(
    "/search",
    validator("query", (value, c) => {
      const q = value["q"];
      if (!q) {
        return c.text("Bad Request", 400);
      }
      return { q };
    }),
    (c) => {
      const { q } = c.req.valid<{ q: string }>("query");
      return c.text(q);
    }
  );

  test("Should return response 200 with valid data", async () => {
    const res = await app.fetch(new Request("http://localhost/search?q=foo"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("foo");
  });

  test("Should return response 400", async () => {
    const res = await app.fetch(new Request("http://localhost/search?foo=bar"));
    expect(res.status).toBe(400);
  });
});

describe("Params", () => {
  const app = new Spectra();
  app.get(
    "/posts/:id",
    validator("params", (value, c) => {
      const id = value["id"];
      if (!id || !id.startsWith("ab")) {
        return c.text("Invalid Id", 400);
      }
      return { id };
    }),
    (c) => {
      const { id } = c.req.valid<{ id: string }>("params");
      return c.text(id);
    }
  );

  test("Should return response 200 with valid data", async () => {
    const res = await app.fetch(new Request("http://localhost/posts/abCdE"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("abCdE");
  });

  test("Should return response 400", async () => {
    const res = await app.fetch(new Request("http://localhost/posts/foo"));
    expect(res.status).toBe(400);
  });
});

describe("Headers", () => {
  const app = new Spectra();
  app.get(
    "/",
    validator("headers", (value, c) => {
      const reqId = value["x-request-id"];
      if (!reqId) {
        return c.text("Bad Request", 400);
      }
      return { reqId };
    }),
    (c) => {
      const { reqId } = c.req.valid<{ reqId: string }>("headers");
      return c.text(reqId);
    }
  );

  test("Should return response 200 with valid data", async () => {
    const res = await app.fetch(
      new Request("http://localhost/", {
        headers: {
          "X-Request-Id": "1",
        },
      })
    );
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("1");
  });

  test("Should return response 400", async () => {
    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(400);
  });
});

describe("Multiple", () => {
  const app = new Spectra();
  app.post(
    "/post",
    validator("json", (value, c) => {
      const name = value["name"];
      if (!name || typeof name !== "string") {
        return c.text("Bad Request", 400);
      }
      return { name };
    }),
    validator("headers", (value, c) => {
      const reqId = value["x-request-id"];
      if (!reqId) {
        return c.text("Bad Request", 400);
      }
      return { reqId };
    }),
    (c) => {
      const { name } = c.req.valid<{ name: string }>("json");
      const { reqId } = c.req.valid<{ reqId: string }>("headers");
      return c.json({ name, reqId });
    }
  );

  test("Should return response 200 with valid data", async () => {
    const res = await app.fetch(
      new Request("http://localhost/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": "1",
        },
        body: JSON.stringify({ name: "Spectra" }),
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ name: "Spectra", reqId: "1" });
  });

  test("Should return response 400", async () => {
    let res = await app.fetch(
      new Request("http://localhost/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": "1",
        },
        body: JSON.stringify({ foo: "bar" }),
      })
    );
    expect(res.status).toBe(400);

    res = await app.fetch(
      new Request("http://localhost/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Spectra" }),
      })
    );
    expect(res.status).toBe(400);
  });
});
