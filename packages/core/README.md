# @spectrajs/core

Spectra is a framework for building efficient, scalable and
typesafe server-side applications.

[![Version](https://img.shields.io/npm/v/@spectrajs/core.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/core)
[![License](https://img.shields.io/npm/l/@spectrajs/core.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/core)
[![Downloads](https://img.shields.io/npm/d18m/@spectrajs/core.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/core)

## Installation

```bash
npm install @spectrajs/core
```

## Documentation

The documentation is available [here](../../docs/index.md).

## Example

```ts
import { Spectra } from "@spectrajs/core";

const app = new Spectra();
app.get("/", (c) => c.text("Spectra!"));

export default app;
```

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
