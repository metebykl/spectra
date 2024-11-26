<h1 align="center">Spectra</h1>

## Request

### raw

Raw request object.

### path

Path of the request.

### param()

Get a path parameter.

```ts
app.get("/users/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ id });
});
```

### params()

Get all path parameters.

```ts
app.get("/users/:userId/posts/:postId", (c) => {
  const { userId, postId } = c.req.params();
  return c.json({ userId, postId });
});
```

### query()

Get a search query value.

```ts
app.get("/search", (c) => {
  // '/search?q=A' -> "A"
  const query = c.req.query("q");
  return c.json({ query });
});

app.get("/search", (c) => {
  // '/search?q=A' -> {q: "A"}
  const { q } = c.req.query();
  return c.json({ q });
});
```

### queries()

Get multiple query parameter values, e.g. /search?q=A&q=B

```ts
app.get("/search", (c) => {
  // '/search?q=A&q=B' -> ["A, "B"]
  const q = c.req.queries("q");
  return c.json({ q });
});

app.get("/search", (c) => {
  // '/search?q=A&q=B' -> {q: ["A, "B"]}
  const { q } = c.req.queries();
  return c.json({ q });
});
```

### header()

Get a header value.

```ts
app.get("/", (c) => {
  const userAgent = c.req.header("User-Agent");
  return c.text(userAgent);
});
```

### json()

Parse request body as JSON.

```ts
app.get("/", (c) => {
  const body = await c.req.json();
  return c.text("Hello World!");
});
```

### text()

Parse request body as text.

```ts
app.get("/", (c) => {
  const body = await c.req.text();
  return c.text("Hello World!");
});
```

### arrayBuffer()

Parse request body as ArrayBuffer.

```ts
app.get("/", (c) => {
  const body = await c.req.arrayBuffer();
  return c.text("Hello World!");
});
```

### formData()

Parse request body as FormData.

```ts
app.get("/", (c) => {
  const body = await c.req.formData();
  return c.text("Hello World!");
});
```

### blob()

Parse request body as Blob.

```ts
app.get("/", (c) => {
  const body = await c.req.blob();
  return c.text("Hello World!");
});
```
