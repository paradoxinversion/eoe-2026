// Polyfill for jsdom canvas used by axe-core during accessibility tests
// Provides a no-op getContext to avoid "Not implemented: HTMLCanvasElement.prototype.getContext" errors
declare global {
  interface HTMLCanvasElement {
    getContext(contextId?: string): any;
  }
}

if (typeof globalThis.HTMLCanvasElement !== "undefined") {
  // Override jsdom's getContext implementation (which throws) with a safe stub
  HTMLCanvasElement.prototype.getContext = function (ctx?: string) {
    if (ctx === "2d") {
      return {
        measureText: (_text: string) => ({ width: 0 }),
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({ data: [] }),
      } as any;
    }
    return {} as any;
  } as any;
}

// Provide a no-op alert implementation for jsdom-based tests
if (typeof globalThis.alert === "undefined") {
  (globalThis as any).alert = () => {};
}

export {};
