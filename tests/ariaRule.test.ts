import { ariaRule } from '../background/rules/aria';
import { RuleResult } from '../background/rules/Rule';

describe('ariaRule', () => {
  it('should detect missing aria-label on button role', () => {
    document.body.innerHTML = '<button role="button"></button>';
    const results: RuleResult[] = ariaRule.check(document);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].message).toContain('aria-label');
    expect(results[0].severity).toBe('error');
  });

  it('should not report when aria-label is present', () => {
    document.body.innerHTML =
      '<button role="button" aria-label="Submit"></button>';
    const results: RuleResult[] = ariaRule.check(document);
    expect(results.length).toBe(0);
  });

  it('should auto-fix missing aria-label', () => {
    document.body.innerHTML = '<button role="button"></button>';
    ariaRule.fix!(document);
    expect(document.querySelector('button')!.hasAttribute('aria-label')).toBe(
      true
    );
  });
});
