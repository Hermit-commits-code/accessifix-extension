import * as contrastModule from '../contrast';

describe('contrastRule (real and mocked)', () => {
  it('does not report error when ratio >= 4.5 (real)', () => {
    const context = document.createElement('div');
    const text = document.createElement('span');
    text.textContent = 'Test';
    text.style.color = '#000000';
    text.style.backgroundColor = '#FFFFFF';
    context.appendChild(text);
    document.body.appendChild(context);
    // Use default getContrastRatio (returns 5)
    const results = contrastModule.contrastRule.check(context);
    expect(results.length).toBe(0);
    document.body.removeChild(context);
  });

  describe('with mocked getContrastRatio', () => {
    it('reports error when ratio < 4.5 (mocked)', () => {
      const context = document.createElement('div');
      const text = document.createElement('span');
      text.textContent = 'Test';
      text.style.color = '#000000';
      text.style.backgroundColor = '#000000';
      context.appendChild(text);
      document.body.appendChild(context);
      // Inject mock contrast ratio function
      const results = contrastModule.contrastRule.check(context, () => 2);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].message).toContain('Insufficient contrast ratio');
      expect(results[0].severity).toBe('error');
      document.body.removeChild(context);
    });
  });
});
