<h1 align="center">Spectra</h1>

## Context

### path

Path of the request.

### method

Request method.

### req

`req` is the instance of SpectraRequest.

### header()

Sets or appends a header.

```ts
// set a header
c.header("X-Foo", "Bar");

// append a header
c.header("X-Foo", "Bar", { append: true });
```

### set() and get()

Get and set key-value pairs tied to the current request.
Allows passing values between middleware and route handlers.

```ts
app.use(async (c, next) => {
  c.set("message", "Hello World!");
  await next();
});

app.get("/", (c) => {
  const message = c.get<string>("message");
  return c.text(message);
});
```

### status()

Sets the status of the response.

```ts
app.get("/", (c) => {
  c.status(201);
  return c.text("Hello World!");
});
```

### text()

Send text with `'Content-Type'` header set to `'text/plain'` if not already set.

```ts
app.get("/", (c) => {
  return c.text("Hello World!");
});
```

### json()

Send json with `'Content-Type'` header set to `'application/json'` if not already set.

```ts
app.get("/", (c) => {
  return c.json({ message: "Hello World!" });
});
```

### html()

Send html with `'Content-Type'` header set to `'text/html'` if not already set.

```ts
app.get("/", (c) => {
  return c.html("<h1>Hello World!</h1>");
});
```

### body()

Return any response of type `string`, `ArrayBuffer`, `ReadableStream`.

> [!NOTE]  
> It is recommended to use existing methods for the data type you want to return such as `c.json()`.

```ts
app.get("/", (c) => {
  return c.body("Hello World!");
});

app.get("/", (c) => {
  return c.body("Hello World!", 201);
});
```

### redirect()

Redirects the user to specified URL via the `'Location'` header. Default status code is 302.

```ts
app.get("/", (c) => {
  return c.redirect("/redirect");
});

app.get("/", (c) => {
  return c.redirect("/redirect", 301);
});
```

### notFound()

Return not found handler of the Spectra instance.

```ts
app.get("/", (c) => {
  return c.notFound();
});
```

### res

Raw response object of the context.
Allows middleware to read or override responses from route handlers.

```ts
app.use("*", async (c, next) => {
  await next();

  // example compression middleware
  const stream = new CompressionStream("gzip");
  c.res = new Response(c.res.body.pipeThrough(stream), c.res);
  c.res.headers.set("Content-Encoding", encoding);
  c.res.headers.delete("Content-Length");
});
```
