import { PerSiteConfig } from '../PerSiteConfig';
import { ExtensionSettings } from '../SettingsSchema';

describe('PerSiteConfig', () => {
  let settings: ExtensionSettings;

  beforeEach(() => {
    settings = {
      enabled: true,
      theme: 'light',
      rules: { contrast: true },
      perSite: {},
    };
  });

  it('sets and gets per-site overrides', () => {
    const hostname = 'example.com';
    const overrides = { foo: 'bar' };
    const updated = PerSiteConfig.setSiteSettings(
      settings,
      hostname,
      overrides
    );
    expect(updated.perSite[hostname]?.overrides).toEqual(overrides);
    const got = PerSiteConfig.getSiteSettings(updated, hostname);
    expect(got).toEqual(overrides);
  });

  it('enables and disables per-site config', () => {
    const hostname = 'example.com';
    let updated = PerSiteConfig.setSiteEnabled(settings, hostname, true);
    expect(updated.perSite[hostname]?.enabled).toBe(true);
    updated = PerSiteConfig.setSiteEnabled(updated, hostname, false);
    expect(updated.perSite[hostname]?.enabled).toBe(false);
  });
});
