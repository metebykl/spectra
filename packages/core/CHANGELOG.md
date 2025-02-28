# @spectrajs/core

## 0.11.0

### Minor Changes

- d6abc8b: Updated middleware import paths to be referenced directly from `@spectrajs/core/<middleware-name>` (e.g., `@spectrajs/core/cors`). The old import paths (`@spectrajs/core/middleware` and `@spectrajs/core/middleware/<middleware-name>`) are deprecated.

## 0.10.0

### Minor Changes

- 3ae73ea: Added ETag middleware.

## 0.9.1

### Patch Changes

- af94795: Fixed missing `.js` import extensions in ESM files, resolving import errors in certain environments.

## 0.9.0

### Minor Changes

- ced315d: Updated header types according to [IANA HTTP Field Name Registry](https://www.iana.org/assignments/http-fields/http-fields.xhtml) and [RFC 4229](https://datatracker.ietf.org/doc/html/rfc4229).
- 9a5581b: Added MIME type utils
- d0356f2: Added support for retrieving all request headers when no name is provided

### Patch Changes

- 98299e0: Updated return type of `query` and `queries` to include `undefined` in record values

## 0.8.0

### Minor Changes

- f81791e: Added support for mounting sub-apps to specific paths using the .route method.

## 0.7.1

### Patch Changes

- ead1949: Support for registering routes with stacked middleware before the final handler.
- bdb34bc: Specify UTF-8 charset for application/json and text/html responses

## 0.7.0

### Minor Changes

- d85b8bc: Export additional types
- b3cb9cb: Add types for HTTP status codes

## 0.6.2

### Patch Changes

- 32aee2a: Specify UTF-8 charset for text/plain responses

## 0.6.1

### Patch Changes

- d1267e8: Handle errors in write and close methods of StreamAPI
- f37b0b9: Implement StreamAPI
- 1432f21: Introduce streaming helper

## 0.6.0

### Minor Changes

- a0b09b3: Moved Node.js adapter from @spectrajs/core to @spectrajs/node
