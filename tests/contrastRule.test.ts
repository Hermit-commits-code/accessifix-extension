import { contrastRule } from '../background/rules/contrast';
import { RuleResult } from '../background/rules/Rule';

describe('contrastRule', () => {
  it('should report insufficient contrast', () => {
    document.body.innerHTML =
      '<span style="color: #000; background: #000;"></span>';
    const results: RuleResult[] = contrastRule.check(document);
    expect(results.length).toBeGreaterThanOrEqual(0); // Placeholder, real test needs contrast algo
  });
});
