<h1 align="center">Spectra</h1>

## Timeout Middleware

The timeout middleware is used to specify the maximum time a request
can take before it is terminated and supports custom timeout handlers.

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { timeout } from "@spectrajs/core/middleware";
```

## Usage

Default handler:

```ts
const app = new Spectra();

// set duration to 5 seconds
app.use(timeout({ duration: 5000 }));

app.get("/", (c) => {
  return c.json({ message: "Hello World!" });
});
```

Custom handler:

```ts
const app = new Spectra();

const timeoutHandler = (c) => c.text("Custom Message", 504);

// set duration to 2 seconds
app.use(timeout({ duration: 2000 }));

app.get("/", async (c) => {
  // simulate a long process
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return c.json({ success: true });
});
```
