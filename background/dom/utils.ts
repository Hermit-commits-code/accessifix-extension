/**
 * getAllElements - Recursively collects all HTMLElements from root, including Shadow DOM and iframes.
 */
export function getAllElements(root: HTMLElement | Document): HTMLElement[] {
  const elements: HTMLElement[] = [];
  const walker = document.createTreeWalker(
    root instanceof Document ? root.body : root,
    NodeFilter.SHOW_ELEMENT
  );
  let node = walker.nextNode();
  while (node) {
    if (node instanceof HTMLElement) {
      elements.push(node);
      // Traverse shadow roots
      if ((node as HTMLElement).shadowRoot) {
        elements.push(
          ...getAllElements(
            (node as HTMLElement).shadowRoot as unknown as HTMLElement
          )
        );
      }
      // Traverse iframes
      if (node.tagName === 'IFRAME') {
        try {
          const iframeDoc = (node as HTMLIFrameElement).contentDocument;
          if (iframeDoc) {
            elements.push(...getAllElements(iframeDoc));
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          /* ignore cross-origin errors */
        }
      }
    }
    node = walker.nextNode();
  }
  return elements;
}
