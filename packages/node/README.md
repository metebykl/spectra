# @spectrajs/node

[![codecov](https://codecov.io/gh/metebykl/spectra/graph/badge.svg)](https://codecov.io/gh/metebykl/spectra)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/metebykl/spectra/ci.yml?branch=main)](https://github.com/metebykl/spectra/actions)
[![License](https://img.shields.io/github/license/metebykl/spectra)](https://github.com/metebykl/spectra/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@spectrajs/node.svg)](https://www.npmjs.com/package/@spectrajs/node)
[![npm](https://img.shields.io/npm/d18m/@spectrajs/node.svg)](https://www.npmjs.com/package/@spectrajs/node)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@spectrajs/node)](https://bundlephobia.com/result?p=@spectrajs/node)

Adapter for using [Spectra](https://github.com/metebykl/spectra) in Node.js environments.

## Installation

```sh
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
