import { ExtensionSettings } from './SettingsSchema';

/**
 * PerSiteConfig
 * -------------
 * Utility class for managing per-site settings in extension storage.
 * Provides methods to get, set, and enable/disable site-specific configuration overrides.
 * Used by extension logic to support granular, site-based accessibility settings.
 */
export class PerSiteConfig {
  /**
   * Get settings for a specific site (hostname)
   */
  static getSiteSettings(
    settings: ExtensionSettings,
    hostname: string
  ): Record<string, unknown> | undefined {
    return settings.perSite[hostname]?.overrides;
  }

  /**
   * Set settings for a specific site (hostname)
   */
  static setSiteSettings(
    settings: ExtensionSettings,
    hostname: string,
    overrides: Record<string, unknown>
  ): ExtensionSettings {
    return {
      ...settings,
      perSite: {
        ...settings.perSite,
        [hostname]: {
          ...settings.perSite[hostname],
          overrides,
        },
      },
    };
  }

  /**
   * Enable or disable extension for a specific site
   */
  static setSiteEnabled(
    settings: ExtensionSettings,
    hostname: string,
    enabled: boolean
  ): ExtensionSettings {
    return {
      ...settings,
      perSite: {
        ...settings.perSite,
        [hostname]: {
          ...settings.perSite[hostname],
          enabled,
        },
      },
    };
  }
}
