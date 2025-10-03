import { ImportExport } from '../ImportExport';
import { ExtensionSettings } from '../SettingsSchema';

describe('ImportExport', () => {
  const validSettings: ExtensionSettings = {
    enabled: true,
    theme: 'dark',
    rules: { contrast: true },
    perSite: {},
  };

  it('exports settings to JSON', () => {
    const json = ImportExport.export(validSettings);
    expect(typeof json).toBe('string');
    expect(json).toContain('enabled');
    expect(json).toContain('theme');
  });

  it('imports valid settings from JSON', () => {
    const json = ImportExport.export(validSettings);
    const imported = ImportExport.import(json);
    expect(imported).toEqual(validSettings);
  });

  it('throws on invalid JSON', () => {
    expect(() => ImportExport.import('not-json')).toThrow(
      'Invalid JSON format'
    );
  });

  it('throws on invalid settings structure', () => {
    const invalidJson = JSON.stringify({ foo: 'bar' });
    expect(() => ImportExport.import(invalidJson)).toThrow();
  });
});
