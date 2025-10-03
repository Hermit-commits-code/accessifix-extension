import { typographyRule } from '../background/rules/typography';
import { RuleResult } from '../background/rules/Rule';

describe('typographyRule', () => {
  it('should report small font size', () => {
    document.body.innerHTML = '<span style="font-size: 12px;"></span>';
    const results: RuleResult[] = typographyRule.check(document);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].message).toContain('below recommended minimum');
    expect(results[0].severity).toBe('warning');
  });

  it('should not report large font size', () => {
    document.body.innerHTML = '<span style="font-size: 18px;"></span>';
    const results: RuleResult[] = typographyRule.check(document);
    expect(results.length).toBe(0);
  });
});
