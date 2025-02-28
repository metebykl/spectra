<h1 align="center">Spectra</h1>

## CORS Middleware

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { cors } from "@spectrajs/core/cors";
```

## Usage

```ts
app.use("*", cors());

app.use(
  "/api/*",
  cors({
    origin: "http://example.com",
    methods: ["GET", "PUT", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Powered-By"],
    maxAge: 5,
    credentials: true,
  })
);
```

## Config

### origin

Will be assigned to `Access-Control-Allow-Origin` header.

@default `true`

Allowed types:

- string
  - eg: `'http://example.com'`
- string[]
  - eg: `['http://example.com', 'http://example.dev']`
- Function - Custom logic
  - Expected type:
  ```ts
  (c: Context) => string | undefined | null;
  ```

### methods

Allowed methods for cross-origin requests.
Will be assigned to `Access-Control-Allow-Methods` header.

@default `["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]`

Allowed types:

- string
  - eg: `'GET, PUT, POST'`
- string[]
  - eg: `['GET', 'PUT', 'POST']`

### allowedHeaders

Allowed headers for the incoming request.
Will be assigned to `Access-Control-Allow-Headers` header.

@default `*`

Allowed types:

- string
  - eg: `'Content-Type, Authorization'`
- string[]
  - eg: `['Content-Type', 'Authorization']`

### exposeHeaders

Will be assigned to `Access-Control-Expose-Headers` header.

@default `*`

Allowed types:

- string
  - eg: `'Content-Length, X-Powered-By'`
- string[]
  - eg: `['Content-Length', 'X-Powered-By']`

### maxAge

Indicates how long the results of a preflight request
(that is, the information contained in the `Access-Control-Allow-Methods`
and `Access-Control-Allow-Headers` headers) can be cached.

@default `5`

### credentials

The HTTP `Access-Control-Allow-Credentials` response header
tells browsers whether the server allows credentials to
be included in cross-origin HTTP requests.

@default `true`
