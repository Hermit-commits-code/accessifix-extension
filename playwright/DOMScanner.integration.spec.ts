// TypeScript lint suppression not needed; Playwright globals are available

declare global {
  interface Window {
    DOMScanner: unknown;
  }
}
import { test, expect } from '@playwright/test';

// This test assumes you have a test HTML page and your DOMScanner is exposed globally for testing.
test.describe('DOMScanner Accessibility Integration', () => {
  test('detects accessibility issues in a real browser', async ({ page }) => {
    // Load the static test page served by playwright/server.js
    await page.goto('http://localhost:8081/testpage.html');
    await page.waitForFunction(() => window.DOMScanner !== undefined);
    const issues = await page.evaluate(() => {
      return (
        window.DOMScanner as unknown as {
          // eslint-disable-next-line no-unused-vars
          scan: (opts: { root: Document }) => unknown[];
        }
      ).scan({ root: document });
    });
    expect(Array.isArray(issues)).toBeTruthy();
    expect(issues.length).toBeGreaterThan(0);
  });

  test('detects accessibility issues on a real website (example.com)', async ({
    page,
  }) => {
    await page.goto('https://example.com');
    // Inject DOMScanner from your build output
    await page.addScriptTag({
      url: 'http://localhost:8081/dist/background.js',
    });
    // Wait for DOMScanner to be available
    await page.waitForFunction(() => window.DOMScanner !== undefined);
    // Register built-in rules in the browser context
    await page.evaluate(() => {
      (
        window.DOMScanner as unknown as {
          registerBuiltInRules: () => void;
        }
      ).registerBuiltInRules();
    });
    // Run scan in browser context
    const issues = await page.evaluate(() => {
      return (
        window.DOMScanner as unknown as {
          scan: (opts: { root: Document }) => unknown[];
        }
      ).scan({ root: document });
    });
    // Suppressed console.log for lint compliance
    void issues;
    expect(Array.isArray(issues)).toBeTruthy();
    // Optionally, assert that some issues are found
    expect(issues.length).toBeGreaterThan(0);
  });
});
