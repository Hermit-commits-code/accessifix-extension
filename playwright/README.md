# Playwright Integration Testing for AccessiFix Extension

## Overview

This folder contains browser-based integration tests for the DOMScanner accessibility engine using Playwright. These tests run in real browsers (Chromium, Firefox, WebKit) and validate accessibility rules in a true user environment.

## Why Playwright?

- Simulates real browser behavior, including styles, tabIndex, ARIA, and dynamic DOM.
- Catches issues missed by Jest/jsdom.
- Ensures your extension is robust and proven for real users.

## How to Run

1. **Build your extension:** Ensure your DOMScanner is available as a global (e.g., via a script tag or build output).
2. **Install dependencies:**
   ```bash
   npm install --save-dev playwright @playwright/test
   npx playwright install
   ```
3. **Run tests:**
   ```bash
   npx playwright test
   ```

## Test Structure

- `DOMScanner.integration.spec.ts`: Main integration test for accessibility rules.
- You can add more tests for other extension features and workflows.

## Notes

- If you use TypeScript, ensure your build outputs a browser-compatible JS file and exposes DOMScanner globally (e.g., `window.DOMScanner = ...`).
- See the integration test for example usage and assertions.

## Next Steps

- Add more integration tests for dynamic content, MutationObserver, and fix applier.
- Integrate Playwright into your CI/CD pipeline for automated browser validation.

---

For questions or help, see [Playwright docs](https://playwright.dev/) or ask your team!
