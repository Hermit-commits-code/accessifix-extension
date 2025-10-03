import { Rule, RuleResult } from './Rule';

/**
 * Typography Rule
 * ---------------------------------------------
 * Ensures text elements use accessible font sizes.
 * Standards: WCAG 1.4.4
 * - Checks for font sizes below 16px
 * - Severity: warning
 */
export const typographyRule: Rule = {
  id: 'font-size',
  description: 'Ensure text elements use accessible font sizes (WCAG 1.4.4).',
  check(context: Document | HTMLElement): RuleResult[] {
    const results: RuleResult[] = [];
    const elements = (
      context instanceof Document ? context.body : context
    ).querySelectorAll('body, body *');
    elements.forEach((el) => {
      const style = window.getComputedStyle(el as Element);
      const fontSize = parseFloat(style.fontSize);
      if (fontSize < 16) {
        results.push({
          ruleId: 'font-size',
          message: `Font size (${fontSize}px) is below recommended minimum (16px). (WCAG 1.4.4)`,
          element: el as HTMLElement,
          severity: 'warning',
        });
      }
    });
    return results;
  },
};
