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
type RuleCheckFn = (el: HTMLElement) => AccessibilityIssue | null;

/**
 * Internal registry for rule check functions
 */
const ruleRegistry: Record<string, RuleCheckFn> = {};

export class DOMScanner {
  /**
   * Scan the DOM for accessibility issues
   * @param options DOMScanOptions
   * @returns Array of AccessibilityIssue
   */
  static scan(options: DOMScanOptions): AccessibilityIssue[] {
    const root = options.root || document;
    const issues: AccessibilityIssue[] = [];
    const rulesToApply = options.rules || Object.keys(ruleRegistry);

    // Traverse all elements, including shadow DOM and iframes
    const elements = getAllElements(root);
    for (const el of elements) {
      // Optionally skip hidden elements
      if (
        !options.includeHidden &&
        el instanceof HTMLElement &&
        el.offsetParent === null
      ) {
        continue;
      }
      // Apply each rule
      for (const ruleId of rulesToApply) {
        const checkFn = ruleRegistry[ruleId];
        if (checkFn) {
          const issue = checkFn(el as HTMLElement);
          if (issue) issues.push(issue);
        }
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
    const observer = new MutationObserver(() => {
      const issues = DOMScanner.scan(options);
      callback(issues);
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
  static registerRule(ruleId: string, checkFn: RuleCheckFn) {
    ruleRegistry[ruleId] = checkFn;
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
            message: 'Element is focusable but lacks ARIA role',
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
    DOMScanner.registerRule('input-label', (el) => {
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
    });

    // ARIA role check
    DOMScanner.registerRule('aria-role', (el) => {
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
    });

    // Form field detection
    DOMScanner.registerRule('form-field', (el) => {
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
    });
  }
}
