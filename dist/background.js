(() => {
  'use strict';
  function e(t) {
    const n = [],
      r = document.createTreeWalker(
        t instanceof Document ? t.body : t,
        NodeFilter.SHOW_ELEMENT
      );
    let o = r.nextNode();
    for (; o; ) {
      if (
        o instanceof HTMLElement &&
        (n.push(o),
        o.shadowRoot && n.push(...e(o.shadowRoot)),
        'IFRAME' === o.tagName)
      )
        try {
          const t = o.contentDocument;
          t && n.push(...e(t));
        } catch (e) {}
      o = r.nextNode();
    }
    return n;
  }
  const t = {};
  class n {
    static scan(n) {
      const r = n.root || document,
        o = [],
        a = n.rules || Object.keys(t),
        i = e(r);
      for (const e of i)
        if (
          n.includeHidden ||
          !(e instanceof HTMLElement) ||
          null !== e.offsetParent
        )
          for (const n of a) {
            const r = t[n];
            if (r) {
              const t = r(e);
              t && o.push(t);
            }
          }
      return o;
    }
    static observeAndScan(e, t) {
      const r = e.root || document,
        o = new MutationObserver(() => {
          const r = n.scan(e);
          t(r);
        });
      return (
        o.observe(r instanceof Document ? r.body : r, {
          childList: !0,
          subtree: !0,
          attributes: !0,
        }),
        t(n.scan(e)),
        o
      );
    }
    static registerRule(e, n) {
      t[e] = n;
    }
    static registerBuiltInRules() {
      (n.registerRule('keyboard-navigation', (e) => {
        if (
          e instanceof HTMLElement &&
          'number' == typeof e.tabIndex &&
          e.tabIndex >= 0
        ) {
          if ('A' === e.tagName && '#main' === e.getAttribute('href'))
            return null;
          const t = e.getAttribute('role');
          if (!t || '' === t)
            return {
              type: 'tab-navigation',
              message: 'Element is focusable but lacks ARIA role',
              node: e,
              ruleId: 'keyboard-navigation',
              severity: 'info',
            };
        }
        return null;
      }),
        n.registerRule('focus-indicator', (e) => {
          if (
            e instanceof HTMLElement &&
            'number' == typeof e.tabIndex &&
            e.tabIndex >= 0
          ) {
            const t =
              e.style.outline || window.getComputedStyle(e).outlineStyle;
            if ('none' === t || '' === t)
              return {
                type: 'missing-focus-indicator',
                message: 'Focusable element lacks visible focus indicator',
                node: e,
                ruleId: 'focus-indicator',
                severity: 'warning',
              };
          }
          return null;
        }),
        n.registerRule('aria-landmark', (e) => {
          if (e instanceof HTMLElement) {
            const t = e.getAttribute('role');
            if (
              t &&
              [
                'banner',
                'navigation',
                'main',
                'complementary',
                'contentinfo',
                'form',
              ].includes(t)
            )
              return {
                type: 'aria-landmark',
                message: `Element is an ARIA landmark: ${t}`,
                node: e,
                ruleId: 'aria-landmark',
                severity: 'info',
              };
          }
          return null;
        }),
        n.registerRule('wcag-contrast', (e) => {
          function t(e) {
            const t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            return t
              ? (parseInt(t[1], 10) / 255) * 0.2126 +
                  (parseInt(t[2], 10) / 255) * 0.7152 +
                  (parseInt(t[3], 10) / 255) * 0.0722
              : 0;
          }
          if (e instanceof HTMLElement) {
            const n = e.style.color || window.getComputedStyle(e).color,
              r =
                e.style.backgroundColor ||
                window.getComputedStyle(e).backgroundColor,
              o = t(n),
              a = t(r),
              i = (Math.max(o, a) + 0.05) / (Math.min(o, a) + 0.05);
            if (i < 4.5)
              return {
                type: 'wcag-low-contrast',
                message: `Text contrast ratio is ${i.toFixed(2)} (WCAG AA requires 4.5)`,
                node: e,
                ruleId: 'wcag-contrast',
                severity: 'error',
              };
          }
          return null;
        }),
        n.registerRule('contrast', (e) =>
          e instanceof HTMLElement &&
          window.getComputedStyle(e).color ===
            window.getComputedStyle(e).backgroundColor
            ? {
                type: 'low-contrast',
                message: 'Text color matches background color',
                node: e,
                ruleId: 'contrast',
                severity: 'error',
              }
            : null
        ),
        n.registerRule('input-label', (e) => {
          if (
            'INPUT' === e.tagName &&
            !e.hasAttribute('aria-label') &&
            !e.hasAttribute('aria-labelledby')
          ) {
            const t = e.getAttribute('id');
            return t && document.querySelector(`label[for="${t}"]`)
              ? null
              : {
                  type: 'missing-label',
                  message: 'Input element missing label or ARIA label',
                  node: e,
                  ruleId: 'input-label',
                  severity: 'warning',
                };
          }
          return null;
        }),
        n.registerRule('aria-role', (e) => {
          if (e instanceof HTMLElement && e.hasAttribute('role')) {
            const t = e.getAttribute('role');
            if (
              t &&
              ![
                'button',
                'navigation',
                'main',
                'form',
                'dialog',
                'banner',
                'contentinfo',
                'complementary',
              ].includes(t)
            )
              return {
                type: 'unknown-aria-role',
                message: `Unknown ARIA role: ${t}`,
                node: e,
                ruleId: 'aria-role',
                severity: 'info',
              };
          }
          return null;
        }),
        n.registerRule('form-field', (e) =>
          'FORM' === e.tagName &&
          0 === e.querySelectorAll('input, select, textarea').length
            ? {
                type: 'empty-form',
                message: 'Form has no input fields',
                node: e,
                ruleId: 'form-field',
                severity: 'warning',
              }
            : null
        ));
    }
  }
  'undefined' != typeof window && (window.DOMScanner = n);
})();
//# sourceMappingURL=background.js.map
