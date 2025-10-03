/**
 * Serializer
 * -----------
 * Interface and default implementation for serializing and deserializing values for storage.
 * Supports dependency injection for custom formats (e.g., encryption, compression).
 * Used by LocalStorageWrapper and other storage modules to ensure consistent value handling.
 */
export interface Serializer {
  // eslint-disable-next-line no-unused-vars
  serialize(value: unknown): string;
  // eslint-disable-next-line no-unused-vars
  deserialize<T>(value: string | null): T | null;
}

export const defaultSerializer: Serializer = {
  serialize: (value) => JSON.stringify(value),
  deserialize: (value) => {
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
};
