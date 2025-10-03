import { Rule, RuleResult } from './Rule';

/**
 * ARIA Attribute Rule
 * ---------------------------------------------
 * Ensures elements with ARIA roles have required ARIA attributes.
 * Standards: WCAG 1.3.1, 4.1.2; ARIA Authoring Practices
 * - Checks for missing aria-label or aria-labelledby on button roles
 * - Extendable for other ARIA roles and attributes
 * Severity: error
 * Auto-fix: Adds aria-label="Button" to button roles missing labels
 */
export const ariaRule: Rule = {
  id: 'aria-attributes',
  description:
    'Ensure elements with ARIA roles have required ARIA attributes (WCAG 1.3.1, 4.1.2).',
  check(context: Document | HTMLElement): RuleResult[] {
    const results: RuleResult[] = [];
    const elements = (
      context instanceof Document ? context.body : context
    ).querySelectorAll('[role]');
    elements.forEach((el) => {
      const role = el.getAttribute('role');
      // Button role should have aria-label or aria-labelledby
      if (
        role === 'button' &&
        !el.hasAttribute('aria-label') &&
        !el.hasAttribute('aria-labelledby')
      ) {
        results.push({
          ruleId: 'aria-attributes',
          message:
            'Button role should have aria-label or aria-labelledby. (WCAG 4.1.2)',
          element: el as HTMLElement,
          severity: 'error',
        });
      }
      // Extend with more role checks as needed
    });
    return results;
  },
  fix(context: Document | HTMLElement): void {
    const elements = (
      context instanceof Document ? context.body : context
    ).querySelectorAll('[role="button"]');
    elements.forEach((el) => {
      if (
        !el.hasAttribute('aria-label') &&
        !el.hasAttribute('aria-labelledby')
      ) {
        el.setAttribute('aria-label', 'Button'); // Example auto-fix
      }
    });
  },
};
