# Spectra

[![codecov](https://codecov.io/gh/metebykl/spectra/graph/badge.svg)](https://codecov.io/gh/metebykl/spectra)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/metebykl/spectra/ci.yml?branch=main)](https://github.com/metebykl/spectra/actions)
[![License](https://img.shields.io/github/license/metebykl/spectra)](https://github.com/metebykl/spectra/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@spectrajs/core.svg)](https://www.npmjs.com/package/@spectrajs/core)
[![npm](https://img.shields.io/npm/d18m/@spectrajs/core.svg)](https://www.npmjs.com/package/@spectrajs/core)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@spectrajs/core)](https://bundlephobia.com/result?p=@spectrajs/core)

**Spectra** is a fast, lightweight, and fully type-safe web framework designed
to simplify the creation of efficent and reliable web applications.

## Features

- 🚀 Optimized for speed and efficiency.
- ✅ Well-tested and production ready.
- 🔨 Full typesafety.
- 🍃 Lightweight - zero dependencies.
- 🔋 Batteries included - built-in middleware, framework integrations and lots of plugins.
- 🌍 Works on Bun, Node.js, Cloudflare Workers, and more runtimes.

## Installation

```sh
npm install @spectrajs/core
```

## Example

```ts
import { Spectra } from "@spectrajs/core";
const app = new Spectra();

app.get("/", (c) => c.text("Spectra!"));

export default app;
```

## Documentation

The documentation is available [here](docs/index.md).

## Packages

- [@spectrajs/core](https://www.npmjs.com/package/@spectrajs/core)
- [@spectrajs/node](https://www.npmjs.com/package/@spectrajs/node)
- [@spectrajs/trpc](https://www.npmjs.com/package/@spectrajs/trpc)
- [@spectrajs/swagger](https://www.npmjs.com/package/@spectrajs/swagger)
- [@spectrajs/zod](https://www.npmjs.com/package/@spectrajs/zod)
- [@spectrajs/arktype](https://www.npmjs.com/package/@spectrajs/arktype)

## Author

Developed by [metebykl](https://github.com/metebykl). Contributions are welcome!

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
