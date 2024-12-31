<h1 align="center">Spectra</h1>

## Node.js

[Node.js](https://nodejs.org) is a free, open-source, cross-platform
JavaScript runtime environment that lets developers create servers,
web apps, command line tools and scripts.

## 1. Setup

### 1.1 Create a new project

```sh
mkdir my-app
cd my-app

npm init -y
npm install @spectrajs/core @spectrajs/node
npm install -D tsx @types/node typescript
```

Create the `tsconfig.json`:

```sh
npx tsc --init
```

Add the following script to your `package.json` file:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

### 1.2 Add to an existing project

```sh
npm install @spectrajs/core @spectrajs/node
```

## 2. Example App

Create a new file `src/index.ts` and add the following code:

```ts
import { Spectra } from "@spectrajs/core";
import { serve } from "@spectrajs/node";

const app = new Spectra();
app.get("/", (c) => c.text("Spectra!"));

serve(app, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});
```

## 3. Run

Run your application.

```sh
npm run dev
```

Then, visit `http://localhost:8282` in your web browser.

## Change port number

You can modify the default port number by doing the following:

```ts
import { Spectra } from "@spectrajs/core";
import { serve } from "@spectrajs/node";

const app = new Spectra();
app.get("/", (c) => c.text("Spectra!"));

serve({
  port: 3000,
  fetch: app.fetch,
});
```
