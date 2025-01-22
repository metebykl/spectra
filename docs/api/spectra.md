<h1 align="center">Spectra</h1>

## App - Spectra

`Spectra` is the core of the framework.

```ts
import { Spectra } from "@spectrajs/core";

const app = new Spectra();
```

### Methods

- app.**use**(path, middleware)
- app.**all**(path, handler)
- app.**get**(path, handler)
- app.**put**(path, handler)
- app.**post**(path, handler)
- app.**delete**(path, handler)
- app.**patch**(path, handler)
- app.**head**(path, handler)
- app.**options**(path, handler)
- app.**trace**(path, handler)
- app.**connect**(path, handler)
- [app.**basePath**(path)](#base-path)
- [app.**route**(path, app)](#route-grouping)
- app.**clone**()
- [app.**notFound**(handler)](#not-found)
- [app.**onError**(handler)](#error-handling)
- [app.**fetch**(request)](#fetch)

### Base Path

`app.basePath` is used to modify the base path of a **Spectra** instance.

```ts
const api = new Spectra().basePath("/api");
api.get("/posts", (c) => c.text("Posts List"));
```

### Route Grouping

`app.route` is used to mount sub-apps to a specific path.

```ts
const api = new Spectra();
api.get("/", (c) => c.text("GET /api"));
api.post("/", (c) => c.text("POST /api"));

const app = new Spectra();
app.route("/api", api);
```

### Not Found

`app.notFound` is used to customize the default Not Found response.

```ts
app.notFound((c) => {
  return c.text("Not Found", 404);
});
```

### Error Handling

`app.onError` is used to handle errors and return customized responses.

```ts
app.onError((c, err) => {
  console.error(err);
  return c.text("Internal Server Error", 500);
});
```

### fetch()

`app.fetch` is the entrypoint of a **Spectra** application.

For testing:

```ts
const req = new Request("http://localhost/");
const res = await app.fetch(req);
```

Bun:

```ts
export default {
  port: 8282,
  fetch: app.fetch,
};
```
