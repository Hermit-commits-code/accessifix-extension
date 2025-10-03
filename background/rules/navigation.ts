import { Rule, RuleResult } from './Rule';

/**
 * Keyboard Navigation Rule
 * ---------------------------------------------
 * Ensures all interactive elements are accessible via keyboard navigation.
 * Standards: WCAG 2.1.1, 2.4.3
 * - Checks for negative tabindex on interactive elements
 * - Severity: warning
 */
export const navigationRule: Rule = {
  id: 'keyboard-navigation',
  description:
    'Ensure all interactive elements are accessible via keyboard navigation (WCAG 2.1.1, 2.4.3).',
  check(context: Document | HTMLElement): RuleResult[] {
    const results: RuleResult[] = [];
    const elements = (
      context instanceof Document ? context.body : context
    ).querySelectorAll('a, button, input, textarea, select, [tabindex]');
    elements.forEach((el) => {
      if ((el as HTMLElement).tabIndex < 0) {
        results.push({
          ruleId: 'keyboard-navigation',
          message:
            'Element is not focusable via keyboard navigation. (WCAG 2.1.1)',
          element: el as HTMLElement,
          severity: 'warning',
        });
      }
    });
    return results;
  },
};
