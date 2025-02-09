<h1 align="center">Spectra</h1>

## Next.js Integration

Spectra can be integrated with [Next.js](https://nextjs.org/)
to create APIs.

## 1. Setup

Get started by creating a new Next.js project using the following command:

```sh
npx create-next-app@latest
```

## 2. Example App

1. Create `api/[[...route]]/route.ts` inside the app router.
2. In `route.ts` create or import an existing Spectra server.
3. Export the handlers for the [methods](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods) you want to expose.

```ts
import { Spectra } from "@spectrajs/core";

const app = new Spectra("/api");

app.get("/", (c) => c.text("Hello World!"));

export const GET = app.fetch;
export const POST = app.fetch;
```

Please refer to [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers) for more information on how to create routes.

## 3. Run

Start the development server using the following command:

```sh
npm run dev
```
