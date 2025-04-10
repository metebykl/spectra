# @spectrajs/arktype

[![codecov](https://codecov.io/gh/metebykl/spectra/graph/badge.svg)](https://codecov.io/gh/metebykl/spectra)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/metebykl/spectra/ci.yml?branch=main)](https://github.com/metebykl/spectra/actions)
[![License](https://img.shields.io/github/license/metebykl/spectra)](https://github.com/metebykl/spectra/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@spectrajs/arktype.svg)](https://www.npmjs.com/package/@spectrajs/arktype)
[![npm](https://img.shields.io/npm/d18m/@spectrajs/arktype.svg)](https://www.npmjs.com/package/@spectrajs/arktype)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@spectrajs/arktype)](https://bundlephobia.com/result?p=@spectrajs/arktype)

A validator middleware using [ArkType](https://arktype.io) for Spectra.

## Installation

```sh
npm install @spectrajs/arktype
```

## Documentation

The documentation is available [here](../../docs/guides/validation.md#arktype-validator).

## Usage

```ts
import { Spectra } from "@spectrajs/core";
import { type } from "arktype";
import { arktypeValidator } from "@spectrajs/arktype";

const app = new Spectra();

const User = type({
  name: "string",
  age: "number",
});

app.post("/post", arktypeValidator("json", User), async (c) => {
  const { name, age } = c.req.valid<typeof User.infer>("json");
  return c.json({ name, age });
});

export default app;
```

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
