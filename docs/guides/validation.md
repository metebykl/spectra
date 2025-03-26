<h1 align="center">Spectra</h1>

## Validation

Spectra offers a simple yet powerful validation system that ensures
incoming data is valid, secure, and properly formatted before processing.

### Core Validator

The Core Validator is the foundation of **Spectra**’s validation system.
It allows you to manually validate data efficiently, without
relying on third-party libraries.

Start by importing `validator` from `@spectrajs/core/validator`:

```ts
import { validator } from "@spectrajs/core/validator";
```

To validate data, specify your `target` as the first argument
and a validation callback as the second argument. In the callback,
validate data and return the validated values at the end.

```ts
app.post(
  "/greet",
  validator("json", (value, c) => {
    const name = value["name"];
    if (!name || typeof name !== "string") {
      return c.text("Invalid Name", 400);
    }
    return {
      name,
    };
  }),
  (c) => {
    const { name } = c.get<{ name: string }>("valid");
    return c.json({ message: `Hi ${name}!` });
  }
);
```

The validated values are stored in `c.get("valid")` and can be safely
accessed in the next middleware.

Validation targets include `json`, `form`, `query`, `params`, and `headers`.

### Zod Validator

The Zod Validator is a middleware that uses [Zod](https://zod.dev) to
validate incoming data. It uses [Core Validator](#core-validator) under the hood.

Start by installing `zod` and `@spectrajs/zod`:

```sh
npm install zod @spectrajs/zod
```

Import `zodValidator` from `@spectrajs/zod` and `z` from `zod`:

```ts
import { zodValidator } from "@spectrajs/zod";
import { z } from "zod";
```

Then, define your schema:

```ts
const schema = z.object({
  name: z.string(),
  age: z.number(),
});
```

Finally, use `zodValidator` to validate incoming data:

```ts
app.post("/post", zodValidator("json", schema), async (c) => {
  const { name, age } = c.get<z.infer<typeof schema>>("valid");
  return c.json({ name, age });
});
```
