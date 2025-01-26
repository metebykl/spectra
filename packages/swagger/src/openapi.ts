/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OpenAPISchema {
  openapi: string;
  info: OpenAPIInfo;
  servers?: OpenAPIServer[];
  paths: Record<string, OpenAPIPathItem>;
  components?: OpenAPIComponents;
  security?: OpenAPISecurityRequirement[];
  tags?: OpenAPITag[];
  externalDocs?: OpenAPIExternalDocumentation;
}

export type OpenAPIInfo = {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;
};

export type OpenAPIContact = {
  name?: string;
  url?: string;
  email?: string;
};

export type OpenAPILicense = {
  name: string;
  url?: string;
};

export type OpenAPITag = {
  name: string;
  description?: string;
  externalDocs?: OpenAPIExternalDocumentation;
};

export type OpenAPIComponents = {
  schemas?: Record<string, OpenAPISchemaObject>;
  responses?: Record<string, OpenAPIResponse>;
  parameters?: Record<string, OpenAPIParameter>;
  examples?: Record<string, OpenAPIExample>;
  requestBodies?: Record<string, OpenAPIRequestBody>;
  headers?: Record<string, OpenAPIHeader>;
  securitySchemes?: Record<string, any>;
  links?: Record<string, OpenAPILink>;
  callbacks?: Record<string, string>;
};

export type OpenAPIPathItem = {
  summary?: string;
  description?: string;
} & Record<string, OpenAPIOperation>;

export type OpenAPIOperation = {
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
};

export type OpenAPIResponses = Record<number, OpenAPIResponse>;

export type OpenAPIResponse = {
  description: string;
  headers?: Record<string, OpenAPIHeader>;
  content?: Record<string, OpenAPIMediaType>;
  links?: Record<string, OpenAPILink>;
};

export type OpenAPIHeader = {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: OpenAPISchemaObject;
  example?: any;
  examples?: Record<string, OpenAPIExample>;
  content?: Record<string, OpenAPIMediaType>;
};

export type OpenAPIMediaType = {
  schema?: OpenAPISchema;
  example?: any;
  examples?: Record<string, OpenAPIExample>;
  encoding?: Record<string, OpenAPIEncoding>;
};

export type OpenAPISchemaObject = {
  nullable?: boolean;
  discriminator?: OpenAPIDiscriminator;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: OpenAPIXMLObject;
  externalDocs?: OpenAPIExternalDocumentation;
  example?: any;
  deprecated?: boolean;
};

export type OpenAPIParameter = {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: OpenAPISchema;
  example?: any;
  examples?: Record<string, OpenAPIExample>;
  content?: Record<string, OpenAPIMediaType>;
};

export type OpenAPIExample = {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
};

export type OpenAPIEncoding = {
  contentType?: string;
  headers?: Record<string, OpenAPIHeader>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
};

export type OpenAPIDiscriminator = {
  propertyName: string;
  mapping?: Record<string, string>;
};

export type OpenAPIXMLObject = {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: string;
  wrapped?: boolean;
};

export type OpenAPIExternalDocumentation = {
  url: string;
  description?: string;
};

export type OpenAPIRequestBody = {
  content: Record<string, OpenAPIMediaType>;
  description?: string;
  required?: boolean;
};

export type OpenAPIServer = {
  url: string;
  description?: string;
  variables?: Record<string, OpenAPIServerVariable>;
};

export type OpenAPIServerVariable = {
  default?: string;
  description?: string;
  enum?: string[];
};

export type OpenAPISecurityRequirement = Record<string, string[]>;

export type OpenAPILink = {
  operationRef?: string;
  operationId?: string;
  parameters?: Record<string, any>;
  requestBody?: any;
  description?: string;
  server?: OpenAPIServer;
};
