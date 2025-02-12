<h1 align="center">Spectra</h1>

## Astro Integration

Spectra can be integrated with [Astro](https://astro.build)
to create APIs.

## 1. Setup

Get started by creating a new Astro project using the following command:

```sh
npm create astro@latest
```

## 2. Example App

1. Set **output** mode to **server** in `astro.config.mjs`.

```ts
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
});
```

2. Create `pages/api/[...route].ts`.
3. In `[...route].ts` create or import an existing Spectra server.
4. Export the handlers for the methods you want to expose.

```ts
import { Spectra } from "@spectrajs/core";

const app = new Spectra("/api");

app.get("/", (c) => c.text("Hello World!"));

const handle = ({ request }: { request: Request }) => app.fetch(request);

export const GET = handle;
export const POST = handle;
```

Please refer to [Astro Endpoints](https://docs.astro.build/en/guides/endpoints) for more information on how to create routes.

## 3. Run

Start the development server using the following command:

```sh
npm run dev
```
