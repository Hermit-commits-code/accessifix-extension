import { navigationRule } from '../navigation';

describe('navigationRule', () => {
  let context: HTMLElement;

  beforeEach(() => {
    context = document.createElement('div');
    document.body.appendChild(context);
  });

  afterEach(() => {
    document.body.removeChild(context);
  });

  it('detects negative tabindex on interactive element', () => {
    const button = document.createElement('button');
    button.tabIndex = -1;
    context.appendChild(button);
    const results = navigationRule.check(context);
    expect(results.length).toBe(1);
    expect(results[0].message).toContain(
      'not focusable via keyboard navigation'
    );
    expect(results[0].severity).toBe('warning');
  });

  it('does not report positive tabindex', () => {
    const input = document.createElement('input');
    input.tabIndex = 0;
    context.appendChild(input);
    const results = navigationRule.check(context);
    expect(results.length).toBe(0);
  });
});
