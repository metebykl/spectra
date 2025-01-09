<h1 align="center">Spectra</h1>

## Testing

Spectra provides the **Spectra.fetch** method, which accepts a Web
Standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
and returns a Response, simulating an HTTP Request.

**Vitest** is a next generation testing framework powered by Vite which we will
use to test our Spectra application in this guide.

Install **Vitest** by running:

```sh
npm install -D vitest
```

Create **test/index.test.ts** in the root of your project with the following:

```ts
import { describe, expect, test } from "vitest";
import { Spectra } from "@spectrajs/core";

describe("Spectra", () => {
  const app = new Spectra()
    .get("/", (c) => {
      return c.text("hi");
    })
    .post("/posts", (c) => {
      return c.json({
        message: "Post created",
      });
    });

  test("GET /", async () => {
    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("hi");
  });

  test("POST /posts", async () => {
    const req = new Request("http://localhost/posts", {
      method: "POST",
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Post created",
    });
  });
});
```

Add the following section to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

Then perform tests by running:

```sh
npm run test
```

Requests to a **Spectra** server must include a full valid URL.

The request URL must meet the following requirements:

| URL                    | Valid |
| ---------------------- | ----- |
| http://localhost/posts | ✅    |
| /posts                 | ❌    |

Spectra supports many testing frameworks like **Vitest**, **Jest** and
built-in test runners such as `bun:test` and `node:test`.
