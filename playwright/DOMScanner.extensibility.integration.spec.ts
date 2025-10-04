import { test, expect } from '@playwright/test';

test.describe('DOMScanner Extensibility & Configuration', () => {
  test('registers and detects a custom rule', async ({ page }) => {
    await page.goto('http://localhost:8081/testpage.html');
    await page.waitForFunction(() => window.DOMScanner !== undefined);
    await page.evaluate(() => {
      (window.DOMScanner as any).registerRule(
        'custom-test',
        (el) => {
          if (el.tagName === 'DIV' && el.textContent === 'Custom') {
            return {
              type: 'custom-detected',
              message: 'Custom rule detected',
              node: el,
              ruleId: 'custom-test',
              severity: 'info',
            };
          }
          return null;
        },
        'div'
      );
    });
    await page.evaluate(() => {
      const div = document.createElement('div');
      div.textContent = 'Custom';
      document.body.appendChild(div);
    });
    const issues = await page.evaluate(() => {
      return (window.DOMScanner as any).scan({
        root: document,
        rules: ['custom-test'],
      });
    });
    expect(issues.some((i: any) => i.ruleId === 'custom-test')).toBeTruthy();
  });

  test('applies per-site and per-rule configuration', async ({ page }) => {
    await page.goto('http://localhost:8081/testpage.html');
    await page.waitForFunction(() => window.DOMScanner !== undefined);
    const config = {
      enabledRules: ['site-test'],
      ruleOptions: { 'site-test': { enabled: true } },
      site: 'localhost',
    };
    const debug = await page.evaluate((config) => {
      let receivedOptions: unknown = undefined;
      (window.DOMScanner as any).registerRule(
        'site-test',
        (el, options) => {
          receivedOptions = options;
          if (el.tagName === 'SPAN' && options && options.enabled) {
            return {
              type: 'site-detected',
              message: 'Site config enabled',
              node: el,
              ruleId: 'site-test',
              severity: 'info',
            };
          }
          return null;
        },
        'span'
      );
      const span = document.createElement('span');
      span.textContent = 'Config';
      document.body.appendChild(span);
      const issues = (window.DOMScanner as any).scan({
        root: document,
        config,
      });
      return { issues, receivedOptions };
    }, config);
    // eslint-disable-next-line no-console
    console.log('Received options in rule:', debug.receivedOptions);
    expect(
      debug.issues.some((i: any) => i.ruleId === 'site-test')
    ).toBeTruthy();
  });
});
