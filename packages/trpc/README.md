# @spectrajs/trpc

A plugin for [Spectra](https://github.com/metebykl/spectra) that provides [tRPC](https://trpc.io) support.

[![Version](https://img.shields.io/npm/v/@spectrajs/trpc.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/trpc)
[![License](https://img.shields.io/npm/l/@spectrajs/trpc.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/trpc)
[![Downloads](https://img.shields.io/npm/d18m/@spectrajs/trpc.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/trpc)

> [!WARNING]
> This package is still in development and is not ready for production use.

## Installation

```bash
npm install @spectrajs/trpc
```

## Documentation

The documentation is available [here](../../docs/plugins/trpc.md).

## Example

```ts
import { trpc } from "@spectrajs/trpc";
import { initTRPC } from "@trpc/server";
import { Spectra } from "@spectrajs/core";

const t = initTRPC.create();
const p = t.procedure;

const router = t.router({
  greet: p.input(String).query(({ input }) => `Hello ${input}!`),
});

const app = new Spectra();

app.use(
  "/trpc/*",
  trpc({
    router,
  })
);
```

## API

### trpc

#### router

The tRPC Router instance.

#### endpoint

The path to the exposed tRPC endpoint.

@default `/trpc`

```ts
app.use(
  "/api/trpc/*",
  trpc({
    endpoint: "/api/trpc",
    router,
  })
);
```

#### createContext

Create custom tRPC context.

```ts
app.use(
  "/trpc/*",
  trpc({
    router,
    createContext: (c, _opts) => ({
      message: c.req.header("X-Message"),
    }),
  })
);
```

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
