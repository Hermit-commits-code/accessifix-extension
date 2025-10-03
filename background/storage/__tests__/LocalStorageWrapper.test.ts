import { LocalStorageWrapper } from '../LocalStorageWrapper';

describe('LocalStorageWrapper', () => {
  const testKey = 'test-key';
  const testValue = { foo: 'bar' };

  afterEach(async () => {
    await LocalStorageWrapper.remove(testKey);
  });

  it('sets and gets a value', async () => {
    await LocalStorageWrapper.set(testKey, testValue);
    const value = await LocalStorageWrapper.get(testKey);
    expect(value).toEqual(testValue);
  });

  it('removes a value', async () => {
    await LocalStorageWrapper.set(testKey, testValue);
    await LocalStorageWrapper.remove(testKey);
    const value = await LocalStorageWrapper.get(testKey);
    expect(value).toBeNull();
  });

  it('returns all keys', async () => {
    await LocalStorageWrapper.set(testKey, testValue);
    const keys = await LocalStorageWrapper.keys();
    expect(keys).toContain(testKey);
  });
});
