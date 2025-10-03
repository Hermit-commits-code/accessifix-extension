import { z } from 'zod';

/**
 * TypeScript interface for extension settings
 */
export interface ExtensionSettings {
  enabled: boolean;
  theme: 'light' | 'dark' | 'system';
  rules: {
    [ruleName: string]: boolean;
  };
  perSite: {
    [hostname: string]: {
      enabled?: boolean;
      overrides?: Record<string, unknown>;
    };
  };
}

/**
 * Zod schema for runtime validation of extension settings
 */
export const ExtensionSettingsSchema = z.object({
  enabled: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  rules: z.record(z.string(), z.boolean()),
  perSite: z.record(
    z.string(),
    z.object({
      enabled: z.boolean().optional(),
      overrides: z.record(z.string(), z.unknown()).optional(),
    })
  ),
});

/**
 * Validate settings object at runtime
 * @param data unknown object
 * @returns ExtensionSettings if valid, throws if invalid
 */
export function validateSettings(data: unknown): ExtensionSettings {
  // Zod infers the correct type, so we can safely cast
  return ExtensionSettingsSchema.parse(data) as ExtensionSettings;
}
