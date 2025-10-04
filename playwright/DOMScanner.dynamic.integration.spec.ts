import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    DOMScanner: unknown;
    __issues: unknown[];
  }
}

test.describe('DOMScanner Dynamic Content & MutationObserver', () => {
  test('detects issues in dynamically added elements', async ({ page }) => {
    await page.goto('http://localhost:8081/testpage.html');
    await page.waitForFunction(() => window.DOMScanner !== undefined);
    // Register built-in rules
    await page.evaluate(() => {
      (
        window.DOMScanner as unknown as {
          registerBuiltInRules: () => void;
        }
      ).registerBuiltInRules();
    });
    // Add dynamic content
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.textContent = 'Dynamic Button';
      btn.tabIndex = 0;
      document.body.appendChild(btn);
    });
    // Wait for MutationObserver to trigger scan
    await page.waitForTimeout(500); // Allow observer to process
    // Scan for issues
    const issues = await page.evaluate(() => {
      return (
        window.DOMScanner as unknown as {
          scan: (opts: { root: Document }) => unknown[];
        }
      ).scan({ root: document });
    });
    expect(
      issues.some(
        (i: unknown) =>
          typeof i === 'object' &&
          i !== null &&
          'ruleId' in i &&
          'type' in i &&
          (i as { ruleId: string; type: string }).ruleId ===
            'keyboard-navigation' &&
          (i as { ruleId: string; type: string }).type === 'tab-navigation'
      )
    ).toBeTruthy();
  });

  test('detects issues after DOM mutation', async ({ page }) => {
    await page.goto('http://localhost:8081/testpage.html');
    await page.waitForFunction(() => window.DOMScanner !== undefined);
    await page.evaluate(() => {
      (
        window.DOMScanner as unknown as {
          registerBuiltInRules: () => void;
        }
      ).registerBuiltInRules();
    });
    // Start observing and scan
    await page.evaluate(() => {
      window.__issues = [];
      (
        window.DOMScanner as unknown as {
          observeAndScan: (
            opts: { root: Document },
            cb: (issues: unknown[]) => void
          ) => void;
        }
      ).observeAndScan({ root: document }, (issues: unknown[]) => {
        window.__issues = issues;
      });
    });
    // Mutate DOM
    await page.evaluate(() => {
      const input = document.createElement('input');
      document.body.appendChild(input);
    });
    await page.waitForTimeout(500);
    // Check for missing label issue
    const issues = await page.evaluate(() => window.__issues);
    expect(
      issues.some(
        (i: unknown) =>
          typeof i === 'object' &&
          i !== null &&
          'ruleId' in i &&
          'type' in i &&
          (i as { ruleId: string; type: string }).ruleId === 'input-label' &&
          (i as { ruleId: string; type: string }).type === 'missing-label'
      )
    ).toBeTruthy();
  });
});
