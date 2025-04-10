import { describe, test, expect } from "vitest";
import { Spectra } from "@spectrajs/core";
import { type } from "arktype";
import { arktypeValidator } from "../src";

describe("Basic", () => {
  const app = new Spectra();

  const User = type({
    name: "3 <= string <= 10",
    age: "number",
  });

  app.post("/greet", arktypeValidator("json", User), (c) => {
    const { name, age } = c.req.valid<typeof User.infer>("json");
    return c.json({ name, age });
  });

  test("Should return response 200", async () => {
    const res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Spectra", age: 20 }),
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ name: "Spectra", age: 20 });
  });

  test("Should return response 400", async () => {
    const res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "ab", age: 20 }),
      })
    );
    expect(res.status).toBe(400);
    const data = (await res.json()) as { success: boolean };
    expect(data.success).toBe(false);
  });

  test("Should return response 400", async () => {
    const res = await app.fetch(
      new Request("http://localhost/greet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Spectra", age: "20" }),
      })
    );
    expect(res.status).toBe(400);
    const data = (await res.json()) as { success: boolean };
    expect(data.success).toBe(false);
  });
});

describe("Headers", () => {
  const app = new Spectra();

  const Schema = type({
    authorization: /^Bearer\s.+$/,
  });

  app.get("/user", arktypeValidator("headers", Schema), (c) => {
    const { authorization } = c.req.valid<typeof Schema.infer>("headers");
    return c.json({ authorization });
  });

  test("Should return response 200", async () => {
    const res = await app.fetch(
      new Request("http://localhost/user", {
        headers: { Authorization: "Bearer abc" },
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ authorization: "Bearer abc" });
  });

  test("Should return response 400", async () => {
    let res = await app.fetch(
      new Request("http://localhost/user", {
        headers: { Authorization: "abc" },
      })
    );
    expect(res.status).toBe(400);
    let data = (await res.json()) as { success: boolean };
    expect(data.success).toBe(false);

    res = await app.fetch(new Request("http://localhost/user"));
    expect(res.status).toBe(400);
    data = (await res.json()) as { success: boolean };
    expect(data.success).toBe(false);
  });
});
