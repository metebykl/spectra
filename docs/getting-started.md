<h1 align="center">Spectra</h1>

## Getting Started

Welcome to Spectra documentation!

This guide will help you get started with the framework.

### Install

```sh
npm install @spectrajs/core
```

### Your first server

```ts
import { Spectra } from "@spectrajs/core";
import { serve } from "@spectrajs/core/adapter/node";

const app = new Spectra();

app.get("/", (c) => c.text("Hello World!"));

serve(app, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});
```
