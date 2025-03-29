import { Spectra } from "./spectra";

/**
 * Types for handlers, middleware handlers, error handlers, and more.
 */
export type {
  Handler,
  MiddlewareHandler,
  Next,
  ErrorHandler,
  ValidationTargets,
} from "./types";

/**
 * Type for context.
 */
export type { Context } from "./context";

/**
 * Type for SpectraRequest.
 */
export type { SpectraRequest } from "./request";

/**
 * Type for status codes.
 */
export type { StatusCode } from "./utils/status";

/**
 * Spectra framework.
 */
export { Spectra };
