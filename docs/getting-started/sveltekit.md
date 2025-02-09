<h1 align="center">Spectra</h1>

## SvelteKit Integration

Spectra can be integrated with [SvelteKit](https://svelte.dev/docs/kit)
to create APIs.

## 1. Setup

Get started by creating a new SvelteKit project using the following command:

```sh
npx sv create
```

## 2. Example App

1. Create `src/routes/[...route]/+server.ts`.
2. In `+server.ts` create or import an existing Spectra server.
3. Export the handlers for the methods you want to expose.

```ts
import { Spectra } from "@spectrajs/core";

const app = new Spectra("/api");

app.get("/", (c) => c.text("Hello World!"));

type RequestHandler = (e: { request: Request }) => Response | Promise<Response>;

export const GET: RequestHandler = ({ request }) => app.fetch(request);
export const POST: RequestHandler = ({ request }) => app.fetch(request);
```

Please refer to [SvelteKit Routing](https://svelte.dev/docs/kit/routing#server) for more information on how to create routes.

## 3. Run

Start the development server using the following command:

```sh
npm run dev
```
