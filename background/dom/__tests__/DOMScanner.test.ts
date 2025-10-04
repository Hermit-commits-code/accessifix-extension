/**
 * DOMScanner unit tests
 */
import { DOMScanner } from '../DOMScanner';

describe('DOMScanner', () => {
  beforeAll(() => {
    // Register a sample rule: flag all <img> without alt
    DOMScanner.registerRule('img-alt', (el) => {
      if (el.tagName === 'IMG' && !(el as HTMLImageElement).alt) {
        return {
          type: 'missing-alt',
          message: 'Image element missing alt attribute',
          node: el,
          ruleId: 'img-alt',
          severity: 'warning',
        };
      }
      return null;
    });
  });

  it('detects missing alt attributes on images', () => {
    // Set up DOM
    document.body.innerHTML = `
      <div>
        <img src="foo.jpg">
        <img src="bar.jpg" alt="desc">
      </div>
    `;
    const issues = DOMScanner.scan({ root: document });
    expect(issues.length).toBe(1);
    expect(issues[0].type).toBe('missing-alt');
    expect(issues[0].message).toContain('missing alt');
  });

  it('detects low contrast text', () => {
    document.body.innerHTML = `
        <div style="color: #fff; background-color: #fff;">Invisible text</div>
        <div style="color: #000; background-color: #fff;">Visible text</div>
      `;
    const issues = DOMScanner.scan({ root: document });
    expect(issues.some((i) => i.type === 'low-contrast')).toBe(true);
  });

  it('detects missing input labels', () => {
    document.body.innerHTML = `
        <input id="foo">
        <label for="foo">Label</label>
        <input id="bar">
      `;
    const issues = DOMScanner.scan({ root: document });
    expect(issues.some((i) => i.type === 'missing-label')).toBe(true);
  });

  it('detects unknown ARIA roles', () => {
    document.body.innerHTML = `
        <div role="unknown"></div>
        <div role="button"></div>
      `;
    const issues = DOMScanner.scan({ root: document });
    expect(issues.some((i) => i.type === 'unknown-aria-role')).toBe(true);
  });

  it('detects empty forms', () => {
    document.body.innerHTML = `
        <form></form>
        <form><input></form>
      `;
    const issues = DOMScanner.scan({ root: document });
    expect(issues.some((i) => i.type === 'empty-form')).toBe(true);
  });

  afterAll(() => {
    document.body.innerHTML = '';
  });
});
