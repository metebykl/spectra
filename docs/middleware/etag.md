<h1 align="center">Spectra</h1>

## ETag Middleware

ETag Middleware lets caches be more efficient and save bandwidth.
Additionally, helping to prevent simultaneous updates of a resource
from overwriting each other [("mid-air collisions")](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag#avoiding_mid-air_collisions).

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { etag } from "@spectrajs/core/middleware";
```

## Usage

```ts
app.use(etag());
```

## Options

### weak?: `boolean`

Option to use [weak validation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests#weak_validation).
When set to `true`, the ETag will be prefixed with `W/`.

@default `false`

### allowedHeaders?: `string[]`

Configures which headers will be preserved from the original response.

@default

```ts
["cache-control", "content-location", "date", "etag", "expires", "vary"];
```

### hashFn?: `(body: Uint8Array) => ArrayBuffer | Promise<ArrayBuffer>`

Option to use a custom hash function. It uses `SHA-1` by default.

Example usage:

```ts
app.use(
  etag({
    hashFn: async (body) => {
      const hash = await crypto.subtle.digest("SHA-256", body);
      return hash;
    },
  })
);
```
