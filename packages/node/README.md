# @spectrajs/node

Adapter for using [Spectra](https://github.com/metebykl/spectra) in Node.js environments.

[![Version](https://img.shields.io/npm/v/@spectrajs/node.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/node)
[![License](https://img.shields.io/npm/l/@spectrajs/node.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/node)
[![Downloads](https://img.shields.io/npm/d18m/@spectrajs/node.svg?style=flat)](https://www.npmjs.com/package/@spectrajs/node)

## Installation

```bash
npm install @spectrajs/node
```

## Documentation

The documentation is available [here](../../docs/getting-started/node.md).

## Example

```ts
import { Spectra } from "@spectrajs/core";
import { serve } from "@spectrajs/node";

const app = new Spectra();
app.get("/", (c) => c.text("Spectra!"));

serve(app);
```

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
