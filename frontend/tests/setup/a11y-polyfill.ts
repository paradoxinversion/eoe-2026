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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    HTMLCanvasElement.prototype.getContext = function () {
        return {};
    } as any;
}

export {};
