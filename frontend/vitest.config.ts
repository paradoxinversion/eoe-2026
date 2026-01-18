import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./tests/setup/a11y-polyfill.ts"],
    },
});
