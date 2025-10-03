/* eslint-disable no-unused-vars */
export interface Rule {
  id: string;
  description: string;
  /**
   * The 'context' parameter is required for all rule implementations,
   * but may not be used directly in the interface definition.
   *
   * eslint-disable-next-line @typescript-eslint/no-unused-vars
   */
  check(context: Document | HTMLElement): RuleResult[];
  /**
   * Optional fix method. 'context' may be unused in some implementations.
   *
   * eslint-disable-next-line @typescript-eslint/no-unused-vars
   */
  fix?(context: Document | HTMLElement): void;
}

export interface RuleResult {
  ruleId: string;
  message: string;
  element: HTMLElement;
  severity: 'info' | 'warning' | 'error';
}
