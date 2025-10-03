import { ExtensionSettings, validateSettings } from './SettingsSchema';

/**
 * ImportExport
 * ------------
 * Utility class for importing and exporting extension settings/configurations.
 * Provides methods to serialize settings to JSON and validate imported settings using Zod schema.
 * Throws on invalid input to ensure data integrity.
 */
export class ImportExport {
  /**
   * Export settings as a JSON string
   */
  static export(settings: ExtensionSettings): string {
    return JSON.stringify(settings, null, 2);
  }

  /**
   * Import settings from a JSON string
   * Throws if invalid
   */
  static import(json: string): ExtensionSettings {
    let data: unknown;
    try {
      data = JSON.parse(json);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new Error('Invalid JSON format');
    }
    // Validate using Zod schema
    return validateSettings(data);
  }
}
