import { DOMScanner } from '../DOMScanner';

describe('DOMScanner accessibility rules', () => {
  /**
   * NOTE: Jest/jsdom has limitations with computed styles, tabIndex, and some DOM properties.
   * These tests may fail even if the rule logic is correct for real browsers.
   * For full coverage, use browser-based integration tests (see template below).
   */
  beforeAll(() => {
    DOMScanner.registerBuiltInRules();
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('detects keyboard navigation issues (tabIndex without role)', () => {
    /**
     * Browser-based integration test template (e.g. Cypress, Playwright):
     *
     * it('detects keyboard navigation issues in browser', () => {
     *   cy.visit('path/to/test/page.html');
     *   cy.window().then(win => {
     *     const issues = win.DOMScanner.scan({ root: win.document });
     *     expect(issues.some(i => i.ruleId === 'keyboard-navigation')).to.be.true;
     *   });
     * });
     */
    // Print all elements and their tabIndex/role
    const allEls = Array.from(document.body.querySelectorAll('*'));
    allEls.forEach((el) => {
      const h = el as HTMLElement;
      // Suppressed console.log for lint compliance
      void h.tagName;
      void h.tabIndex;
      void h.getAttribute('role');
    });
    const div = document.createElement('div');
    div.tabIndex = 0;
    document.body.appendChild(div);
    const button = document.createElement('button');
    button.tabIndex = 0;
    document.body.appendChild(button);
    const skipLink = document.createElement('a');
    skipLink.tabIndex = 0;
    skipLink.setAttribute('href', '#main');
    document.body.appendChild(skipLink);
    const issues = DOMScanner.scan({ root: document });
    // Debug output
    // console.log('Keyboard nav issues:', issues);
    expect(
      issues.some(
        (i) => i.ruleId === 'keyboard-navigation' && i.type === 'tab-navigation'
      )
    ).toBe(true);
    expect(
      issues.some(
        (i) =>
          i.ruleId === 'keyboard-navigation' && i.message.includes('skip link')
      )
    ).toBe(false);
  });

  it('detects missing focus indicators', () => {
    // Print all elements and their outline
    const allEls = Array.from(document.body.querySelectorAll('*'));
    allEls.forEach((el) => {
      const h = el as HTMLElement;
      // Suppressed console.log for lint compliance
      void h.tagName;
      void h.style.outline;
    });
    // Mock getComputedStyle for outline detection
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = (el: Element) => {
      const real = originalGetComputedStyle(el);
      const style = (el as HTMLElement).style;
      return Object.assign(Object.create(real), {
        outlineStyle: style.outline,
        getPropertyValue: (prop: string) => style.getPropertyValue(prop),
      });
    };
    const btnNoFocus = document.createElement('button');
    btnNoFocus.tabIndex = 0;
    btnNoFocus.textContent = 'No Focus';
    btnNoFocus.style.outline = 'none';
    document.body.appendChild(btnNoFocus);
    const btnHasFocus = document.createElement('button');
    btnHasFocus.tabIndex = 0;
    btnHasFocus.textContent = 'Has Focus';
    btnHasFocus.style.outline = 'auto';
    document.body.appendChild(btnHasFocus);
    const issues = DOMScanner.scan({ root: document });
    // Debug output
    // console.log('Focus indicator issues:', issues);
    // Debug output
    // console.log('Focus indicator issues:', issues);
    expect(
      issues.some(
        (i) =>
          i.ruleId === 'focus-indicator' && i.type === 'missing-focus-indicator'
      )
    ).toBe(true);
    window.getComputedStyle = originalGetComputedStyle;
  });

  it('detects ARIA landmarks', () => {
    // Print all elements and their role
    const allEls = Array.from(document.body.querySelectorAll('*'));
    allEls.forEach((el) => {
      const h = el as HTMLElement;
      // Suppressed console.log for lint compliance
      void h.tagName;
      void h.getAttribute('role');
    });
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    document.body.appendChild(nav);
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.appendChild(main);
    const div = document.createElement('div');
    div.setAttribute('role', 'foo');
    document.body.appendChild(div);
    const issues = DOMScanner.scan({ root: document });
    // Debug output
    // console.log('ARIA landmark issues:', issues);
    expect(
      issues.filter(
        (i) => i.ruleId === 'aria-landmark' && i.type === 'aria-landmark'
      ).length
    ).toBe(2);
  });

  it('detects WCAG color contrast issues', () => {
    // Print all elements and their color/backgroundColor
    const allEls = Array.from(document.body.querySelectorAll('*'));
    allEls.forEach((el) => {
      const h = el as HTMLElement;
      // Suppressed console.log for lint compliance
      void h.tagName;
      void h.style.color;
      void h.style.backgroundColor;
    });
    // Mock getComputedStyle for color contrast detection
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = (el: Element) => {
      const real = originalGetComputedStyle(el);
      const style = (el as HTMLElement).style;
      return Object.assign(Object.create(real), {
        color: style.color,
        backgroundColor: style.backgroundColor,
        getPropertyValue: (prop: string) => style.getPropertyValue(prop),
      });
    };
    const lowContrast = document.createElement('span');
    lowContrast.textContent = 'Low Contrast';
    lowContrast.style.color = 'rgb(255,255,255)';
    lowContrast.style.backgroundColor = 'rgb(255,255,255)';
    document.body.appendChild(lowContrast);
    const goodContrast = document.createElement('span');
    goodContrast.textContent = 'Good Contrast';
    goodContrast.style.color = 'rgb(0,0,0)';
    goodContrast.style.backgroundColor = 'rgb(255,255,255)';
    document.body.appendChild(goodContrast);
    const issues = DOMScanner.scan({ root: document });
    // Debug output
    // console.log('WCAG contrast issues:', issues);
    // Debug output
    // console.log('WCAG contrast issues:', issues);
    expect(
      issues.some(
        (i) => i.ruleId === 'wcag-contrast' && i.type === 'wcag-low-contrast'
      )
    ).toBe(true);
    window.getComputedStyle = originalGetComputedStyle;
  });
});
