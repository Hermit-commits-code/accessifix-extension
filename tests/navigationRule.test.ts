import { navigationRule } from '../background/rules/navigation';
import { RuleResult } from '../background/rules/Rule';

describe('navigationRule', () => {
  it('should report unfocusable element', () => {
    document.body.innerHTML = '<button tabindex="-1"></button>';
    const results: RuleResult[] = navigationRule.check(document);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].message).toContain('not focusable');
    expect(results[0].severity).toBe('warning');
  });

  it('should not report focusable element', () => {
    document.body.innerHTML = '<button tabindex="0"></button>';
    const results: RuleResult[] = navigationRule.check(document);
    expect(results.length).toBe(0);
  });
});
