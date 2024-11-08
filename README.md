# Spectra

**Spectra** is a fast, lightweight, and fully typesafe web framework designed to simplify the creation of web applications. Spectra integrates type safety at every layer, providing great developer experience and minimizing runtime errors.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Routing](#routing)
  - [Context Handling](#context-handling)
- [Examples](#examples)
  - [Basic Example](#basic-example)

## Installation

> [!WARNING]  
> As Spectra is still in development, you should clone the repository and import Spectra from the source code directly.

## Features

- **Fast Routing**: Lightweight routing with minimal overhead for fast requests.
- **Full Type Safety**: Built with TypeScript for strong typing and enhanced reliability.
- **Minimalistic Core**: Only the essentials for building a solid server, with no unnecessary dependencies.
- **Multi-runtime**: Works on Node.js for now. More adapters will be developed.

## Quick Start

Here’s a quick example to get your Spectra server up and running:

```typescript
import { Spectra } from "../src";
import { serve } from "../src/adapter/node";

const app = new Spectra();

app.get("/", (c) => c.json({ message: "Hello World!" }));

serve(app);
```

## API Reference

### Routing

Spectra supports `GET`, `POST`, and other HTTP methods, which you can attach to your app instance to define routes:

- `.get(path, handler)`: Define a route that listens to `GET` requests.
- `.post(path, handler)`: Define a route that listens to `POST` requests.

### Middleware

Middleware functions are used to perform actions before or after handlers. You can add middleware to your Spectra instance by the `.use()` method. Middleware functions receive the context (`c`) and a `next` function, which should be called to pass control to the next middleware or handler.

```typescript
app.use(async (c, next) => {
  console.log(new Date().toISOString(), c.method, c.path);
  await next();
});
```

#### Execution order

The order in which middleware is executed is determined by the order in which it is registered. See below.

```typescript
app.use(async (_, next) => {
  console.log("middleware 1 start");
  await next();
  console.log("middleware 1 end");
});
app.use(async (_, next) => {
  console.log("middleware 2 start");
  await next();
  console.log("middleware 2 end");
});

app.get("/", (c) => {
  console.log("handler");
  return c.text("Hello World!");
});
```

The result will be:

```
middleware 1 start
  middleware 2 start
    handler
  middleware 2 end
middleware 1 end
```

### Context

The handler function receives a context (`c`) object containing request and response utilities:

- `c.json(data, statusCode)`: Send JSON responses.
- `c.text(text, statusCode)`: Send plain text responses.
- `c.html(text, statusCode)`: Send HTML responses.
- `c.req`: Access the request object with methods like `.header()` for headers and `.params()` for URL parameters.

## Examples

### Basic Example

Here’s an example illustrating a simple API that handles basic routing and data manipulation:

```typescript
import { Spectra } from "../src";
import { serve } from "../src/adapter/node";

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

serve(app);
```

## Author

Developed by [metebykl](https://github.com/metebykl). Contributions are welcome!
