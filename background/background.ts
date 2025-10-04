// background/background.ts
// AccessiFix Extension Background Script
// Handles rule engine coordination and extension events

import { DOMScanner } from './dom/DOMScanner';
// Expose DOMScanner globally for browser-based tests (Playwright)
declare global {
  interface Window {
    DOMScanner: typeof DOMScanner;
  }
}
if (typeof window !== 'undefined') {
  window.DOMScanner = DOMScanner;
}
export {};
