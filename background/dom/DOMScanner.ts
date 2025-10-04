/**
 * DOMScanner
 * ----------
 * Scans the DOM for accessibility issues using rule-based logic.
 * Extensible for future rules and plugins.
 */

export interface DOMScanOptions {
  root?: HTMLElement | Document;
  includeHidden?: boolean;
  rules?: string[]; // List of rule IDs to apply
  config?: DOMScannerConfig;
}

export interface DOMScannerConfig {
  enabledRules?: string[];
  disabledRules?: string[];
  ruleOptions?: Record<string, unknown>;
  site?: string;
}

export interface AccessibilityIssue {
  type: string;
  message: string;
  node: HTMLElement;
  ruleId: string;
  severity: 'info' | 'warning' | 'error';
}

import { getAllElements } from './utils';
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RuleCheckFn = (
  el: HTMLElement,
  options?: unknown
) => AccessibilityIssue | null;
interface RuleMeta {
  checkFn: RuleCheckFn;
  selector?: string;
}

/**
 * Internal registry for rule check functions
 */
const ruleRegistry: Record<string, RuleMeta> = {};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pluginRegistry: Record<string, (scanner: typeof DOMScanner) => void> = {};

export class DOMScanner {
  /**
   * Scan the DOM for accessibility issues
   * @param options DOMScanOptions
   * @returns Array of AccessibilityIssue
   */
  static scan(options: DOMScanOptions): AccessibilityIssue[] {
    const root = options.root || document;
    const issues: AccessibilityIssue[] = [];
    let rulesToApply = options.rules || Object.keys(ruleRegistry);
    // Deep clone config for browser context serialization
    const config = options.config
      ? JSON.parse(JSON.stringify(options.config))
      : undefined;
    // Apply config filtering
    if (config) {
      if (config.enabledRules) {
        rulesToApply = rulesToApply.filter((r) =>
          config.enabledRules!.includes(r)
        );
      }
      if (config.disabledRules) {
        rulesToApply = rulesToApply.filter(
          (r) => !config.disabledRules!.includes(r)
        );
      }
    }
    for (const ruleId of rulesToApply) {
      const ruleMeta = ruleRegistry[ruleId];
      if (!ruleMeta) continue;
      let elements: HTMLElement[] = [];
      if (ruleMeta.selector) {
        // Use querySelectorAll for targeted elements
        elements = Array.from(
          (root instanceof Document ? root.body : root).querySelectorAll(
            ruleMeta.selector
          )
        );
      } else {
        // Fallback to all elements
        elements = getAllElements(root);
      }
      for (const el of elements) {
        if (
          !options.includeHidden &&
          el instanceof HTMLElement &&
          el.offsetParent === null
        ) {
          continue;
        }
        // Always pass an object for ruleOptions
        const ruleOptions = config?.ruleOptions?.[ruleId] ?? {};
        const issue = ruleMeta.checkFn(el, ruleOptions);
        if (issue) issues.push(issue);
      }
    }
    return issues;
  }

  /**
   * Utility to scan Shadow DOM and iframes recursively
   */

  // Removed the getAllElements function definition as it is now imported from utils.ts

  /**
   * Observe dynamic DOM changes and re-scan as needed
   */
  static observeAndScan(
    options: DOMScanOptions,
    // eslint-disable-next-line no-unused-vars
    callback: (_issues: AccessibilityIssue[]) => void
  ): MutationObserver {
    const root = options.root || document;
    let debounceTimer: number | null = null;
    const DEBOUNCE_MS = 100;
    const observer = new MutationObserver(() => {
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(() => {
        const issues = DOMScanner.scan(options);
        callback(issues);
        debounceTimer = null;
      }, DEBOUNCE_MS);
    });
    observer.observe(root instanceof Document ? root.body : root, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    // Initial scan
    callback(DOMScanner.scan(options));
    return observer;
  }

  /**
   * Placeholder for future plugin/rule registration
   */
  static registerRule(ruleId: string, checkFn: RuleCheckFn, selector?: string) {
    ruleRegistry[ruleId] = { checkFn, selector };
  }

  /**
   * Register a plugin that can add rules or extend scanner functionality
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static registerPlugin(
    pluginId: string,
    pluginFn: (scanner: typeof DOMScanner) => void
  ) {
    pluginRegistry[pluginId] = pluginFn;
  }

  /**
   * Load a plugin by id
   */
  static loadPlugin(pluginId: string) {
    if (pluginRegistry[pluginId]) {
      pluginRegistry[pluginId](DOMScanner);
    }
  }

  /**
   * Built-in accessibility rules
   */
  static registerBuiltInRules() {
    // Keyboard navigation: tabIndex check and skip link presence
    DOMScanner.registerRule('keyboard-navigation', (el) => {
      if (
        el instanceof HTMLElement &&
        typeof el.tabIndex === 'number' &&
        el.tabIndex >= 0
      ) {
        // Check for skip link
        if (el.tagName === 'A' && el.getAttribute('href') === '#main') {
          return null;
        }
        // Flag elements with tabIndex but no clear navigation role
        const role = el.getAttribute('role');
        if (!role || role === '') {
          return {
            type: 'tab-navigation',
            message: 'Element is focusable but has no ARIA role',
            node: el,
            ruleId: 'keyboard-navigation',
            severity: 'info',
          };
        }
      }
      return null;
    });

    // Focus indicator: check for outline style
    DOMScanner.registerRule('focus-indicator', (el) => {
      if (
        el instanceof HTMLElement &&
        typeof el.tabIndex === 'number' &&
        el.tabIndex >= 0
      ) {
        // Check both inline and computed style for outline
        const outline =
          el.style.outline || window.getComputedStyle(el).outlineStyle;
        if (outline === 'none' || outline === '') {
          return {
            type: 'missing-focus-indicator',
            message: 'Focusable element lacks visible focus indicator',
            node: el,
            ruleId: 'focus-indicator',
            severity: 'warning',
          };
        }
      }
      return null;
    });

    // ARIA landmark detection
    DOMScanner.registerRule('aria-landmark', (el) => {
      if (el instanceof HTMLElement) {
        const role = el.getAttribute('role');
        const landmarkRoles = [
          'banner',
          'navigation',
          'main',
          'complementary',
          'contentinfo',
          'form',
        ];
        if (role && landmarkRoles.includes(role)) {
          return {
            type: 'aria-landmark',
            message: `Element is an ARIA landmark: ${role}`,
            node: el,
            ruleId: 'aria-landmark',
            severity: 'info',
          };
        }
      }
      return null;
    });

    // WCAG color contrast (basic, for demo)
    DOMScanner.registerRule('wcag-contrast', (el) => {
      // Parse rgb(a) strings to get luminance
      function getLuminance(rgb: string): number {
        const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return 0;
        const r = parseInt(m[1], 10) / 255;
        const g = parseInt(m[2], 10) / 255;
        const b = parseInt(m[3], 10) / 255;
        // sRGB luminance formula
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }
      if (el instanceof HTMLElement) {
        // Check both inline and computed style for color and background
        const color = el.style.color || window.getComputedStyle(el).color;
        const bg =
          el.style.backgroundColor ||
          window.getComputedStyle(el).backgroundColor;

        const lum1 = getLuminance(color);
        const lum2 = getLuminance(bg);
        const contrast =
          (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
        if (contrast < 4.5) {
          return {
            type: 'wcag-low-contrast',
            message: `Text contrast ratio is ${contrast.toFixed(2)} (WCAG AA requires 4.5)`,
            node: el,
            ruleId: 'wcag-contrast',
            severity: 'error',
          };
        }
      }
      return null;
    });
    // Contrast check (very basic, for demo)
    DOMScanner.registerRule('contrast', (el) => {
      if (el instanceof HTMLElement) {
        const color = window.getComputedStyle(el).color;
        const bg = window.getComputedStyle(el).backgroundColor;
        // Simple check: if color and bg are the same, flag
        if (color === bg) {
          return {
            type: 'low-contrast',
            message: 'Text color matches background color',
            node: el,
            ruleId: 'contrast',
            severity: 'error',
          };
        }
      }
      return null;
    });

    // Label presence for inputs
    DOMScanner.registerRule(
      'input-label',
      (el) => {
        if (
          el.tagName === 'INPUT' &&
          !el.hasAttribute('aria-label') &&
          !el.hasAttribute('aria-labelledby')
        ) {
          // Check for associated <label>
          const id = el.getAttribute('id');
          if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) return null;
          }
          return {
            type: 'missing-label',
            message: 'Input element missing label or ARIA label',
            node: el,
            ruleId: 'input-label',
            severity: 'warning',
          };
        }
        return null;
      },
      'input'
    );

    // ARIA role check
    DOMScanner.registerRule(
      'aria-role',
      (el) => {
        if (el instanceof HTMLElement && el.hasAttribute('role')) {
          const role = el.getAttribute('role');
          // Example: flag unknown roles
          const knownRoles = [
            'button',
            'navigation',
            'main',
            'form',
            'dialog',
            'banner',
            'contentinfo',
            'complementary',
          ];
          if (role && !knownRoles.includes(role)) {
            return {
              type: 'unknown-aria-role',
              message: `Unknown ARIA role: ${role}`,
              node: el,
              ruleId: 'aria-role',
              severity: 'info',
            };
          }
        }
        return null;
      },
      '[role]'
    );

    // Form field detection
    DOMScanner.registerRule(
      'form-field',
      (el) => {
        if (el.tagName === 'FORM') {
          const inputs = el.querySelectorAll('input, select, textarea');
          if (inputs.length === 0) {
            return {
              type: 'empty-form',
              message: 'Form has no input fields',
              node: el,
              ruleId: 'form-field',
              severity: 'warning',
            };
          }
        }
        return null;
      },
      'form'
    );
  }
}
