/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { ExtensionSettingsSchema, validateSettings } from '../SettingsSchema';

describe('SettingsSchema', () => {
  it('validates correct settings', () => {
    const valid = {
      enabled: true,
      theme: 'dark',
      rules: { contrast: true, aria: false },
      perSite: {
        'example.com': { enabled: true, overrides: { foo: 'bar' } },
      },
    };
    expect(() => validateSettings(valid)).not.toThrow();
    expect(validateSettings(valid)).toEqual(valid);
  });

  it('throws on invalid settings', () => {
    const invalid = {
      enabled: 'yes', // should be boolean
      theme: 'blue', // invalid enum
      rules: { contrast: 'yes' }, // should be boolean
      perSite: {},
    };
    expect(() => validateSettings(invalid)).toThrow();
  });
});
