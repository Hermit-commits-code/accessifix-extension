/**
 * mockStorage - Jest mock implementation of IStorage for unit tests.
 * Usage: Import and use in tests to simulate storage operations and error cases.
 */
export const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Dummy test to satisfy Jest
describe('mockStorage utility', () => {
  it('should be defined', () => {
    expect(mockStorage).toBeDefined();
  });
});
