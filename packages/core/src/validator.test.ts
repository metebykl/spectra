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
      const { name } = c.get("valid") as { name: string };
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
    const res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: 1 }),
      })
    );
    expect(res.status).toBe(400);
  });

  test("Should return response 400", async () => {
    const res = await app.fetch(
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
      return c.json(c.get("valid"));
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
    validator("form", (value, c) => {
      const name = value.get("name");
      if (!name || typeof name !== "string") {
        return c.text("Bad Request", 400);
      }
      return value;
    }),
    (c) => {
      const formData = c.get("valid") as FormData;
      return c.text(`Hi ${formData.get("name")}!`);
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
    expect(await res.text()).toBe("Hi Spectra!");
  });

  test("Should return response 400", async () => {
    const formData = new FormData();
    formData.append("foo", "bar");
    const res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        body: formData,
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("Malformed FormData request", () => {
  const app = new Spectra();
  app.post(
    "/post",
    validator("form", (value) => value),
    (c) => {
      return c.json(c.get("valid"));
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
      const { q } = c.get("valid") as { q: string };
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
      const { id } = c.get("valid") as { id: string };
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
      const { reqId } = c.get("valid") as { reqId: string };
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
