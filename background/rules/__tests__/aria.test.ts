import { ariaRule } from '../aria';

describe('ariaRule', () => {
  let context: HTMLElement;

  beforeEach(() => {
    context = document.createElement('div');
    document.body.appendChild(context);
  });

  afterEach(() => {
    document.body.removeChild(context);
  });

  it('detects missing aria-label on button role', () => {
    const button = document.createElement('button');
    button.setAttribute('role', 'button');
    context.appendChild(button);
    const results = ariaRule.check(context);
    expect(results).toHaveLength(1);
    expect(results[0].message).toContain('aria-label');
    expect(results[0].severity).toBe('error');
  });

  it('does not report button with aria-label', () => {
    const button = document.createElement('button');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', 'Submit');
    context.appendChild(button);
    const results = ariaRule.check(context);
    expect(results).toHaveLength(0);
  });

  it('auto-fixes missing aria-label', () => {
    const button = document.createElement('button');
    button.setAttribute('role', 'button');
    context.appendChild(button);
    if (ariaRule.fix) {
      ariaRule.fix(context);
    }
    expect(button.getAttribute('aria-label')).toBe('Button');
  });
});
