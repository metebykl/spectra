<h1 align="center">Spectra</h1>

## Request ID Middleware

The Request ID Middleware is used to generate a unique ID for
every request, which will be used in handlers.

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { requestId } from "@spectrajs/core/middleware";
```

## Usage

```ts
app.use("*", requestId());

app.get("/", (c) => {
  const id = c.get("requestId");
  return c.json({ id });
});
```

## Options

### headerName: `string`

The header name to be used for the request ID.

@default `X-Request-Id`

### generator: `(c: Context) => string`

The function that generates request IDs.

@default `crypto.randomUUID()`
