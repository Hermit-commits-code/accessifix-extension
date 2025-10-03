import { LocalStorageWrapper } from '../LocalStorageWrapper';
import { defaultSerializer } from '../Serializer';
import { defaultErrorHandler } from '../ErrorHandler';

describe('LocalStorageWrapper error handling with mock storage', () => {
  const errorStorage = {
    getItem: () => {
      throw new Error('get error');
    },
    setItem: () => {
      throw new Error('set error');
    },
    removeItem: () => {
      throw new Error('remove error');
    },
  };

  beforeAll(() => {
    LocalStorageWrapper.setStorage(errorStorage);
  });
  afterAll(() => {
    LocalStorageWrapper.setStorage(window.localStorage);
  });

  it('handles get error', async () => {
    const value = await LocalStorageWrapper.get('bad-key');
    expect(value).toBeNull();
  });

  it('handles set error', async () => {
    const result = await LocalStorageWrapper.set('bad-key', { foo: 'bar' });
    expect(result).toBe(false);
  });

  it('handles remove error', async () => {
    const result = await LocalStorageWrapper.remove('bad-key');
    expect(result).toBe(false);
  });
});

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

describe('LocalStorageWrapper custom serializer', () => {
  const testKey = 'custom-serializer-key';
  const testValue = { foo: 'bar' };
  const customSerializer = {
    serialize: (value: unknown) => `custom:${JSON.stringify(value)}`,
    deserialize: (value: string | null) => {
      if (!value || !value.startsWith('custom:')) return null;
      return JSON.parse(value.slice(7));
    },
  };

  beforeAll(() => {
    LocalStorageWrapper.setSerializer(customSerializer);
  });
  afterAll(() => {
    LocalStorageWrapper.setSerializer(defaultSerializer);
  });

  it('uses custom serializer for set/get', async () => {
    await LocalStorageWrapper.set(testKey, testValue);
    const value = await LocalStorageWrapper.get(testKey);
    expect(value).toEqual(testValue);
  });
});

describe('LocalStorageWrapper custom error handler', () => {
  const errorStorage = {
    getItem: () => {
      throw new Error('get error');
    },
    setItem: () => {
      throw new Error('set error');
    },
    removeItem: () => {
      throw new Error('remove error');
    },
  };
  const errorLog: string[] = [];
  const customErrorHandler = (context: string, err: unknown) => {
    errorLog.push(`${context}: ${String((err as Error).message)}`);
  };

  beforeAll(() => {
    LocalStorageWrapper.setStorage(errorStorage);
    LocalStorageWrapper.setErrorHandler(customErrorHandler);
  });
  afterAll(() => {
    LocalStorageWrapper.setStorage(window.localStorage);
    LocalStorageWrapper.setErrorHandler(defaultErrorHandler);
  });

  it('logs errors via custom handler', async () => {
    await LocalStorageWrapper.get('bad-key');
    await LocalStorageWrapper.set('bad-key', { foo: 'bar' });
    await LocalStorageWrapper.remove('bad-key');
    expect(errorLog.length).toBe(3);
    expect(errorLog[0]).toMatch(/Failed to get key/);
    expect(errorLog[1]).toMatch(/Failed to set key/);
    expect(errorLog[2]).toMatch(/Failed to remove key/);
  });
});

describe('LocalStorageWrapper edge cases', () => {
  const testKey = 'edge-case-key';

  it('returns null for non-existent key', async () => {
    const value = await LocalStorageWrapper.get(testKey);
    expect(value).toBeNull();
  });

  it('handles malformed data gracefully', async () => {
    window.localStorage.setItem(testKey, 'not-json');
    const value = await LocalStorageWrapper.get(testKey);
    expect(value).toBeNull();
    await LocalStorageWrapper.remove(testKey);
  });
});
