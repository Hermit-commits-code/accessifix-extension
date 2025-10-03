/* eslint-disable no-unused-vars */
import { RuleEngine } from '../background/rules/RuleEngine';
import { Rule, RuleResult } from '../background/rules/Rule';

// Sample mock rules for testing
const mockRule: Rule = {
  id: 'mock-rule',
  description: 'A mock rule for testing.',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check(context: Document | HTMLElement): RuleResult[] {
    return [
      {
        ruleId: 'mock-rule',
        message: 'Mock rule triggered.',
        element: document.body,
        severity: 'info',
      },
    ];
  },
};

describe('RuleEngine', () => {
  let engine: RuleEngine;

  beforeEach(() => {
    engine = new RuleEngine();
  });

  it('should register rules', () => {
    engine.registerRule(mockRule);
    expect(engine.getRules().length).toBe(1);
  });

  it('should run rules and collect results', () => {
    engine.registerRule(mockRule);
    const results = engine.run(document);
    expect(results.length).toBe(1);
    expect(results[0].ruleId).toBe('mock-rule');
  });

  it('should handle rule errors gracefully', () => {
    const errorRule: Rule = {
      id: 'error-rule',
      description: 'Throws error.',
      check() {
        throw new Error('Test error');
      },
    };
    engine.registerRule(errorRule);
    const results = engine.run(document);
    expect(results[0].severity).toBe('error');
    expect(results[0].message).toContain('Error running rule');
  });
});
