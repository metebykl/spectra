<h1 align="center">Spectra</h1>

## Swagger Plugin

A plugin for serving [Swagger (OpenAPI v3)](https://swagger.io/specification)
schemas, which are automatically generated from your routes.

## Installation

```sh
npm install @spectrajs/swagger
```

## Usage

```ts
import { Spectra } from "@spectrajs/core";
import { describeRoute, openAPISpecs, swaggerUI } from "@spectrajs/swagger";

const app = new Spectra();

app.get(
  "/",
  describeRoute({
    description: "Greet the user",
    responses: {
      200: {
        description: "Successful greeting response",
        content: {
          "text/plain": {
            example: "Hi Spectra!",
          },
        },
      },
    },
  }),
  (c) => {
    const name = c.req.query("name");
    return c.text(`Hi ${name}!`);
  }
);

app.use(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Spectra",
        version: "1.0.0",
        description: "Example API",
      },
      servers: [
        {
          url: "http://localhost:8282",
          description: "Example Server",
        },
      ],
    },
  })
);

app.use("/swagger", swaggerUI({ url: "/openapi" }));
```

## API

### describeRoute

Add a description to a route, which will be included in the
[OpenAPI](https://spec.openapis.org/oas/v3.1.0.html) specification.

```ts
interface OpenAPIOperation {
  summary?: string;
  description?: string;
  tags?: string[];
  responses: OpenAPIResponses;
  operationId?: string;
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  callbacks?: Record<string, OpenAPIPathItem>;
  deprecated?: boolean;
  security?: OpenAPISecurityRequirement[];
  servers?: OpenAPIServer[];
}
```

### openAPISpecs

Generate an [OpenAPI](https://spec.openapis.org/oas/v3.1.0.html)
specification for your application.

#### documentation?: `OpenAPIDocument`

Customize the documentation.

#### exclude?: `string[]`

Paths to exclude from the documentation.

#### excludeMethods?: `HttpMethod[]`

Methods to exclude from the documentation.

#### excludeTags?: `string[]`

Tags to exclude from the documentation.

### swaggerUI

Generate a [Swagger UI](https://swagger.io/tools/swagger-ui) page documenting your application.

```ts
type SwaggerUIOptions = Omit<
  Partial<SwaggerUIConfigOptions>,
  "dom_id" | "dom_node" | "url" | "urls" | "spec"
> & {
  url: string;
  title?: string;
  version?: string;
};
```

### swaggerEditor

Serve [Swagger Editor](https://editor.swagger.io) on a specific route.

```ts
type SwaggerEditorOptions = Omit<
  Partial<SwaggerUIConfigOptions>,
  "dom_id" | "dom_node" | "url" | "urls" | "spec" | "presets"
> & {
  title?: string;
  version?: string;
};
```
