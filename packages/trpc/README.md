<div align="center">
<h1>
  Spectra
</h1>
<p>
  Fast, lightweight and fully typesafe web framework
</p>

</div>

# `@spectrajs/trpc`

The `@spectrajs/trpc` package provides tRPC support.

> [!WARNING]
> This package is still in development and is not ready for production use.

## Installation

```bash
# npm
npm install @spectrajs/trpc

# yarn
yarn add @spectrajs/trpc

# pnpm
pnpm add @spectrajs/trpc

# bun
bun add @spectrajs/trpc
```

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
