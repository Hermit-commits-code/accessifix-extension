import { Rule, RuleResult } from './Rule';

export class RuleEngine {
  private rules: Rule[] = [];

  /**
   * Returns the registered rules for testing and inspection.
   */
  public getRules(): Rule[] {
    return this.rules;
  }

  registerRule(rule: Rule): void {
    this.rules.push(rule);
  }

  run(context: Document | HTMLElement): RuleResult[] {
    let results: RuleResult[] = [];
    for (const rule of this.rules) {
      try {
        results = results.concat(rule.check(context));
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      } catch (e) {
        // 'e' is used in the error message for reporting purposes
        results.push({
          ruleId: rule.id,
          message: `Error running rule: ${e}`,
          element: context instanceof HTMLElement ? context : document.body,
          severity: 'error',
        });
      }
    }
    return results;
  }

  fixAll(context: Document | HTMLElement): void {
    for (const rule of this.rules) {
      if (typeof rule.fix === 'function') {
        try {
          rule.fix(context);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // Optionally log or handle fix errors
        }
      }
    }
  }
}
