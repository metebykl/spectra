<h1 align="center">Spectra</h1>

## Powered-by Middleware

The powered-by middleware adds a `X-Powered-By` header to the response.
By default, it is set to `Spectra` and can be customized.

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { poweredBy } from "@spectrajs/core/middleware";
```

## Usage

```ts
const app = new Spectra();

app.use("/api", poweredBy());

app.use("/custom", poweredBy({ serverName: "Custom" }));
```
