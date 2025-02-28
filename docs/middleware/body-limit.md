<h1 align="center">Spectra</h1>

## Body Limit Middleware

The body limit middleware is used to limit the size of the request body
using the `Content-Length` header. If it is not set, it reads the body stream.
If the body size exceeds the specified limit, the middleware will invoke
the provided handler or send a 413 status code with a default message.

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { bodyLimit } from "@spectrajs/core/body-limit";
```

## Usage

```ts
const app = new Spectra();

app.use(bodyLimit({ maxSize: 64 * 1024 })); // 64kb
```

With custom handler:

```ts
const app = new Spectra();

app.use(
  bodyLimit({
    maxSize: 64 * 1024,
    onError: (c) => c.text("Too Large", 413),
  })
);
```

## Options

### maxSize: `number`

Maximum size of the request body.

### onError?: `BodyLimitErrorHandler`

The handler to be invoked if the specified limit is exceeded.
