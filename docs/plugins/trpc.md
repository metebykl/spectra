<h1 align="center">Spectra</h1>

## tRPC Plugin

This plugin adds support for using [tRPC](https://trpc.io).

## Installation

```sh
npm install @spectrajs/trpc @trpc/server
```

## Usage

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
    endpoint: "/trpc",
    router,
  })
);
```

## trpc

### router

The tRPC Router instance.

### endpoint

The path to the exposed tRPC endpoint.

### createContext

Create custom tRPC context.

```ts
app.use(
  "/trpc/*",
  trpc({
    endpoint: "/trpc",
    router,
    createContext: (c, _opts) => ({
      message: c.req.header("X-Message"),
    }),
  })
);
```
