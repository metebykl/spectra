# @spectrajs/trpc

[![codecov](https://codecov.io/gh/metebykl/spectra/graph/badge.svg)](https://codecov.io/gh/metebykl/spectra)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/metebykl/spectra/ci.yml?branch=main)](https://github.com/metebykl/spectra/actions)
[![License](https://img.shields.io/github/license/metebykl/spectra)](https://github.com/metebykl/spectra/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@spectrajs/trpc.svg)](https://www.npmjs.com/package/@spectrajs/trpc)
[![npm](https://img.shields.io/npm/d18m/@spectrajs/trpc.svg)](https://www.npmjs.com/package/@spectrajs/trpc)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@spectrajs/trpc)](https://bundlephobia.com/result?p=@spectrajs/trpc)

A plugin for [Spectra](https://github.com/metebykl/spectra) that provides [tRPC](https://trpc.io) support.

## Installation

```sh
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
