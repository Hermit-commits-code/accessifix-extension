import { typographyRule } from '../typography';

describe('typographyRule', () => {
  let context: HTMLElement;

  beforeEach(() => {
    context = document.createElement('div');
    document.body.appendChild(context);
  });

  afterEach(() => {
    document.body.removeChild(context);
  });

  it('detects font size below 16px', () => {
    const text = document.createElement('span');
    text.textContent = 'Test';
    text.style.fontSize = '12px';
    context.appendChild(text);
    const results = typographyRule.check(context);
    expect(results.length).toBe(1);
    expect(results[0].message).toContain('below recommended minimum');
    expect(results[0].severity).toBe('warning');
  });

  it('does not report font size 16px or above', () => {
    const text = document.createElement('span');
    text.textContent = 'Test';
    text.style.fontSize = '16px';
    context.appendChild(text);
    const results = typographyRule.check(context);
    expect(results.length).toBe(0);
  });
});
