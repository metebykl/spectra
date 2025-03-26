# @spectrajs/zod

[![codecov](https://codecov.io/gh/metebykl/spectra/graph/badge.svg)](https://codecov.io/gh/metebykl/spectra)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/metebykl/spectra/ci.yml?branch=main)](https://github.com/metebykl/spectra/actions)
[![License](https://img.shields.io/github/license/metebykl/spectra)](https://github.com/metebykl/spectra/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@spectrajs/zod.svg)](https://www.npmjs.com/package/@spectrajs/zod)
[![npm](https://img.shields.io/npm/d18m/@spectrajs/zod.svg)](https://www.npmjs.com/package/@spectrajs/zod)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@spectrajs/zod)](https://bundlephobia.com/result?p=@spectrajs/zod)

A validator middleware using [Zod](https://zod.dev) for Spectra.

## Installation

```sh
npm install @spectrajs/zod
```

## Documentation

The documentation is available [here](../../docs/guides/validation.md#zod-validator).

## Usage

```ts
import { Spectra } from "@spectrajs/core";
import { z } from "zod";
import { zodValidator } from "@spectrajs/zod";

const app = new Spectra();

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

app.post("/post", zodValidator("json", schema), async (c) => {
  const { name, age } = c.get<z.infer<typeof schema>>("valid");
  return c.json({ name, age });
});

export default app;
```

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
