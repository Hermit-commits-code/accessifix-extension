/* eslint-disable no-unused-vars */
import { RuleEngine } from '../RuleEngine';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Rule, RuleResult } from '../Rule';

describe('RuleEngine', () => {
  let engine: RuleEngine;
  let mockRule: Rule;
  let mockContext: HTMLElement;

  beforeEach(() => {
    engine = new RuleEngine();
    mockContext = document.createElement('div');
    mockRule = {
      id: 'mock-rule',
      description: 'A mock rule',
      check: jest.fn().mockReturnValue([
        {
          ruleId: 'mock-rule',
          message: 'Mock check passed',
          element: mockContext,
          severity: 'info',
        },
      ]),
      fix: jest.fn(),
    };
  });

  it('registers rules', () => {
    engine.registerRule(mockRule);
    expect(engine.getRules()).toContain(mockRule);
  });

  it('runs rules and returns results', () => {
    engine.registerRule(mockRule);
    const results = engine.run(mockContext);
    expect(results).toHaveLength(1);
    expect(results[0].message).toBe('Mock check passed');
  });

  it('handles rule check errors gracefully', () => {
    const errorRule: Rule = {
      id: 'error-rule',
      description: 'Throws error',
      check: () => {
        throw new Error('Test error');
      },
    };
    engine.registerRule(errorRule);
    const results = engine.run(mockContext);
    expect(results[0].ruleId).toBe('error-rule');
    expect(results[0].severity).toBe('error');
    expect(results[0].message).toContain('Error running rule');
  });

  it('calls fix on all rules with fix method', () => {
    engine.registerRule(mockRule);
    engine.fixAll(mockContext);
    expect(mockRule.fix).toHaveBeenCalledWith(mockContext);
  });

  it('skips fix for rules without fix method', () => {
    const noFixRule: Rule = {
      id: 'no-fix',
      description: 'No fix method',
      check: jest.fn().mockReturnValue([]),
    };
    engine.registerRule(noFixRule);
    expect(() => engine.fixAll(mockContext)).not.toThrow();
  });
});
