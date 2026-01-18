// Polyfill for jsdom canvas used by axe-core during accessibility tests
// Provides a no-op getContext to avoid "Not implemented: HTMLCanvasElement.prototype.getContext" errors
declare global {
  interface HTMLCanvasElement {
    getContext(contextId?: string): any;
  }
}

if (
  typeof globalThis.HTMLCanvasElement !== "undefined" &&
  !HTMLCanvasElement.prototype.getContext
) {
  // Provide a minimal 2D context stub expected by some a11y checks
  HTMLCanvasElement.prototype.getContext = function (ctx?: string) {
    if (ctx === "2d") {
      return {
        // minimal methods used by libs (measureText may be inspected)
        measureText: (_text: string) => ({ width: 0 }),
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({ data: [] }),
      } as any;
    }
    return {} as any;
  } as any;
}

export {};
