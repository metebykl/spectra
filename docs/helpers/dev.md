<h1 align="center">Spectra</h1>

## Dev Helper

Dev Helper provides helper functions for development purposes.

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { listRoutes } from "@spectrajs/core/dev";
```

## `listRoutes()`

`listRoutes()` function logs the routes that are registered to a Spectra instance.

```ts
const app = new Spectra();

app.get("/api/tasks", (c) => c.json([]));
app.post("/api/tasks", (c) => c.json({ success: true }));

listRoutes(app);
```

Result will be:

```txt
GET   /api/tasks
POST  /api/tasks
```

## Options

### verbose

When set to `true`, the output will be verbose.

@default `false`

### colorize

When set to `true`, the output will be colorized.

@default `false`
