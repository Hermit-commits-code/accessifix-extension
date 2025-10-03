# Test Utilities for Storage Modules

This folder contains reusable test helpers, mocks, and setup logic for storage-related tests in the extension.

## Usage

- Place any shared mock implementations, custom matchers, or setup/teardown logic here.
- Import from this folder in your test files to avoid duplication and keep tests maintainable.

## Example

```ts
// utils/mockStorage.ts
export const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
```

## Structure

- `mockStorage.ts`: Example mock for IStorage interface
- Add more helpers as needed
