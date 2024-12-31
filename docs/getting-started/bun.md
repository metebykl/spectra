<h1 align="center">Spectra</h1>

## Bun

[Bun](https://bun.sh) is an all-in-one JavaScript runtime & toolkit
designed for speed, complete with a bundler, test runner, and
Node.js-compatible package manager.

## 1. Install Bun

To install bun, follow the instructions in [the official web site](https://bun.sh).

## 2. Setup

### 2.1 Create a new project

```sh
mkdir my-app
cd my-app

bun init
bun add @spectrajs/core
```

### 2.2 Add to an existing project

```sh
bun add @spectrajs/core
```

## 3. Example App

Create a new file `src/index.ts` and add the following code:

```ts
import { Spectra } from "@spectrajs/core";

const app = new Spectra();
app.get("/", (c) => c.text("Spectra!"));

export default app;
```

## 4. Run

Run your application.

```sh
bun --watch src/index.ts
```

Then, visit `http://localhost:3000` in your web browser.

## Change port number

You can modify the default port number by exporting the port.

```ts
import { Spectra } from "@spectrajs/core";

const app = new Spectra();
app.get("/", (c) => c.text("Spectra!"));

export default {
  port: 8282,
  fetch: app.fetch,
};
```
