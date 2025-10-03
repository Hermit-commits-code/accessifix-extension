import { ExtensionSettings } from './SettingsSchema';

/**
 * PerSiteConfig - Utility for managing per-site settings in extension storage.
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
