import { defaultErrorHandler, ErrorHandler } from './ErrorHandler';
import { defaultSerializer, Serializer } from './Serializer';

export type StorageKey = string;
export type StorageValue = unknown;

export interface IStorage {
  // eslint-disable-next-line no-unused-vars
  getItem(key: string): string | null;
  // eslint-disable-next-line no-unused-vars
  setItem(key: string, value: string): void;
  // eslint-disable-next-line no-unused-vars
  removeItem(key: string): void;
}

/**
 * LocalStorageWrapper - Robust, injectable wrapper for browser/local storage.
 * Supports dependency injection for error handling and serialization.
 * Provides async API for get/set/remove operations with error handling and custom serialization.
 * Usage:
 *   - Set custom storage, error handler, or serializer via static setters.
 *   - Defaults to window.localStorage, defaultErrorHandler, and defaultSerializer.
 */
export class LocalStorageWrapper {
  private static storage: IStorage | null = null;
  private static errorHandler: ErrorHandler = defaultErrorHandler;
  private static serializer: Serializer = defaultSerializer;

  static setStorage(storage: IStorage) {
    LocalStorageWrapper.storage = storage;
  }

  static setErrorHandler(handler: ErrorHandler) {
    LocalStorageWrapper.errorHandler = handler;
  }

  static setSerializer(serializer: Serializer) {
    LocalStorageWrapper.serializer = serializer;
  }

  static async get<T = StorageValue>(key: StorageKey): Promise<T | null> {
    try {
      let value: string | null;
      if (!LocalStorageWrapper.storage) {
        value = window.localStorage.getItem(key);
      } else if (LocalStorageWrapper.storage === window.localStorage) {
        value = window.localStorage.getItem(key);
      } else {
        value = LocalStorageWrapper.storage.getItem(key);
      }
      return LocalStorageWrapper.serializer.deserialize<T>(value);
    } catch (err) {
      LocalStorageWrapper.errorHandler(`Failed to get key '${key}'`, err);
      return null;
    }
  }

  static async set(key: StorageKey, value: StorageValue): Promise<boolean> {
    try {
      const serialized = LocalStorageWrapper.serializer.serialize(value);
      if (!LocalStorageWrapper.storage) {
        window.localStorage.setItem(key, serialized);
      } else if (LocalStorageWrapper.storage === window.localStorage) {
        window.localStorage.setItem(key, serialized);
      } else {
        LocalStorageWrapper.storage.setItem(key, serialized);
      }
      return true;
    } catch (err) {
      LocalStorageWrapper.errorHandler(`Failed to set key '${key}'`, err);
      return false;
    }
  }

  static async remove(key: StorageKey): Promise<boolean> {
    try {
      if (!LocalStorageWrapper.storage) {
        window.localStorage.removeItem(key);
      } else if (LocalStorageWrapper.storage === window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        LocalStorageWrapper.storage.removeItem(key);
      }
      return true;
    } catch (err) {
      LocalStorageWrapper.errorHandler(`Failed to remove key '${key}'`, err);
      return false;
    }
  }

  static async keys(): Promise<string[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let storage: IStorage | any;
      if (!LocalStorageWrapper.storage) {
        storage = window.localStorage;
      } else if (LocalStorageWrapper.storage === window.localStorage) {
        storage = window.localStorage;
      } else {
        storage = LocalStorageWrapper.storage;
      }
      // Only works for real localStorage, not mocks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Object.keys(storage as any);
    } catch (err) {
      LocalStorageWrapper.errorHandler('Failed to get keys', err);
      return [];
    }
  }
}
