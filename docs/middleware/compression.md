<h1 align="center">Spectra</h1>

## Compression Middleware

The compression middleware compresses the response body, reducing
the size of the response. The middleware will choose the best
encoding based on the `Accept-Encoding` headers if not specified.

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { compression } from "@spectrajs/core/middleware";
```

## Usage

Default options:

```ts
const app = new Spectra();

app.use(compression());
```

Custom options:

```ts
const app = new Spectra();

app.use(
  compression({
    encoding: "deflate",
    threshold: 2048,
  })
);
```

## Options

### encoding: `'gzip'` | `'deflate'`

Specifies the encoding algorithm to use for compression. Can be either
`gzip` or `deflate`. If not specified, the middleware will choose based
on the `Accept-Encoding` headers.

### threshold: `number`

Specifies the minimum size in bytes to compress. Defaults to `1024`.
