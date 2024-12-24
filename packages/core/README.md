<div align="center">
<h1>
  Spectra
</h1>
<p>
  Fast, lightweight and fully typesafe web framework
</p>

<a href="https://www.npmjs.com/package/@spectrajs/core"><img alt="NPM version" src="https://img.shields.io/npm/v/@spectrajs/core.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://www.npmjs.com/package/@spectrajs/core"><img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/@spectrajs/core?style=for-the-badge&labelColor=000000"></a>

</div>

# `@spectrajs/core`

The `@spectrajs/core` package provides the core functionality of the framework and is used to create applications.

## Installation

```bash
# npm
npm install @spectrajs/core

# Yarn
yarn add @spectrajs/core

# pnpm
pnpm add @spectrajs/core

# Bun
bun add @spectrajs/core
```

## Documentation

Full documentation is available [here](../../docs/index.md).

## Basic Example

```typescript
import { Spectra } from "@spectrajs/core";

const tasks = [{ name: "Example Task" }];

const app = new Spectra()
  .get("/", (c) => c.json({ message: "Hello World!" }))
  .get("/user-agent", (c) => {
    const ua = c.req.header("User-Agent");
    return c.text(ua || "Unknown");
  })
  .get("/tasks", (c) => c.json({ tasks }))
  .post("/tasks", async (c) => {
    const body = await c.req.json();
    tasks.push({ name: body.name });
    return c.json({ message: "Task created" }, 201);
  })
  .get("/users/:userId", (c) => {
    const { userId } = c.req.params();
    return c.json({ userId });
  });
```
