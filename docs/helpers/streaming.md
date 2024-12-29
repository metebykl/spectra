<h1 align="center">Spectra</h1>

## Streaming Helper

Streaming Helper provides methods for writing data to
the response stream. It is a wrapper for the `StreamAPI`
which provides methods for working with streams.

## Import

```ts
import { Spectra } from "@spectrajs/core";
import { stream } from "@spectrajs/core/stream";
```

## Examples

Example of streaming a response.

```ts
app.get("/", (c) => {
  return stream(c, async (stream) => {
    await stream.write("foo");
    await stream.write("bar");
  });
});
```

Example of streaming a response with a delay.

```ts
app.get("/", (c) => {
  return stream(c, async (stream) => {
    for (let i = 0; i < 3; i++) {
      await stream.write(new Uint8Array([i]));
      await stream.sleep(1);
    }
  });
});
```

## Abort Handling

```ts
app.get("/", (c) => {
  return stream(c, async (stream) => {
    stream.onAbort(() => {
      console.log("Aborted");
    });

    await stream.write("Spectra");
  });
});
```

## Error Handling

```ts
app.get("/", (c) => {
  return stream(
    c,
    async (stream) => {
      throw new Error("Failed");
    },
    (err, stream) => {
      stream.writeln("Something went wrong!");
      console.error(err);
    }
  );
});
```
