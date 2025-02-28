<h1 align="center">Spectra</h1>

## Logger Middleware

The logger middleware logs the request and response details to the console.

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { logger } from "@spectrajs/core/logger";
```

## Usage

```ts
const app = new Spectra();

app.use(logger());

app.get("/", (c) => {
  return c.json({ message: "Hello World!" });
});
```

## Options

### fn: `PrintFn(str: string, ...rest: string[])`

```ts
const loggerFn = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

app.use(logger({ fn: loggerFn }));
```

### colorize: `boolean` (default: `true`)

Whether to colorize the log output.
