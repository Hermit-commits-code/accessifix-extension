/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * LocalStorageWrapper - Robust async wrapper for browser local storage with error handling.
 * Used for extension settings, per-site configs, and import/export base.
 */

export type StorageKey = string;
export type StorageValue = unknown;
/**
 * Handles storage errors in a centralized way (can be replaced with logging service).
 */
// eslint-disable-next-line no-unused-vars
function handleStorageError(context: string, err: unknown): void {
  // TODO: Integrate with extension logging/reporting system
  // For now, suppress or optionally log to a debug channel
  // Uncomment for development:
  // if (process.env.NODE_ENV === 'development') {
  //   console.warn(`[Storage] ${context}:`, err);
  // }
}

export class LocalStorageWrapper {
  /**
   * Get a value from local storage.
   * @param key Storage key
   * @returns Promise resolving to value or null
   */
  static async get(key: StorageKey): Promise<StorageValue | null> {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      handleStorageError(`Failed to get key '${key}'`, err);
      return null;
    }
  }

  /**
   * Set a value in local storage.
   * @param key Storage key
   * @param value Value to store
   * @returns Promise resolving to true if successful
   */
  static async set(key: StorageKey, value: StorageValue): Promise<boolean> {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      handleStorageError(`Failed to set key '${key}'`, err);
      return false;
    }
  }

  /**
   * Remove a key from local storage.
   * @param key Storage key
   * @returns Promise resolving to true if successful
   */
  static async remove(key: StorageKey): Promise<boolean> {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      handleStorageError(`Failed to remove key '${key}'`, err);
      return false;
    }
  }

  /**
   * Get all keys in local storage.
   * @returns Promise resolving to array of keys
   */
  static async keys(): Promise<string[]> {
    try {
      return Object.keys(window.localStorage);
    } catch (err) {
      handleStorageError('Failed to get keys', err);
      return [];
    }
  }
}
