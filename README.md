# Spectra

**Spectra** is a fast, lightweight, and fully typesafe web framework designed to simplify the creation of web applications. Spectra integrates type safety at every layer, providing great developer experience and minimizing runtime errors.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](docs/index.md)
- [Examples](#examples)

## Installation

```bash
npm install @spectrajs/core
```

## Features

- **Fast Routing**: Lightweight routing with minimal overhead for fast requests.
- **Full Type Safety**: Built with TypeScript for strong typing and enhanced reliability.
- **Minimalistic Core**: Only the essentials for building a solid server, with no unnecessary dependencies.
- **Multi-runtime**: Works on Node.js and Bun for now. More adapters will be developed.

## Quick Start

Here’s a quick example to get your Spectra server up and running:

```typescript
import { Spectra } from "@spectrajs/core";
import { serve } from "@spectrajs/core/adapter/node";

const app = new Spectra();

app.get("/", (c) => c.text("Spectra"));

serve(app);
```

## Documentation

The documentation is available [here](docs/index.md).

## Examples

### Basic Example

Here’s an example illustrating a simple API that handles basic routing and data manipulation:

```typescript
import { Spectra } from "@spectrajs/core";
import { serve } from "@spectrajs/core/adapter/node";

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

serve(app, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});
```

## Author

Developed by [metebykl](https://github.com/metebykl). Contributions are welcome!
