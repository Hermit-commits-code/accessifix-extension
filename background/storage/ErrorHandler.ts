/* eslint-disable no-unused-vars */
/**
 * ErrorHandler
 * ------------
 * Type and default implementation for centralized error handling in storage operations.
 * Allows injection of custom error reporting, logging, or suppression logic.
 * Used by LocalStorageWrapper and other modules to handle errors consistently.
 */
// eslint-disable-next-line no-unused-vars
export type ErrorHandler = (context: string, err: unknown) => void;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const defaultErrorHandler: ErrorHandler = (context, err) => {
  // Suppress or log to debug channel
  // Uncomment for development:
  // if (process.env.NODE_ENV === 'development') {
  //   console.warn(`[Storage] ${context}:`, err);
  // }
};
