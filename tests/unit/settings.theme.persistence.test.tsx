/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";

describe("Settings theme persistence", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("defaults to Dark when no preferences exist and saves on toggle", async () => {
        const saveConfigMock = vi.fn().mockResolvedValue(undefined);
        // simulate no existing preferences
        vi.doMock("../../frontend/src/services/persistence", () => ({
            loadConfig: vi.fn().mockResolvedValue(null),
            saveConfig: saveConfigMock,
        }));

        const { default: Settings } =
            await import("../../frontend/src/pages/Dashboard/Settings");

        render(React.createElement(Settings));

        // Initially should show Dark
        expect(screen.getByText(/Theme: Dark/i)).toBeTruthy();

        // Toggle to Light
        const switchControl = screen.getByLabelText(/Theme:/i);
        fireEvent.click(switchControl);

        await waitFor(() => {
            expect(saveConfigMock).toHaveBeenCalled();
        });

        // Ensure saveConfig was called with preferences and theme set to light
        const [[nameArg, configArg]] = saveConfigMock.mock.calls as any;
        expect(nameArg).toBe("preferences");
        expect(configArg).toHaveProperty("theme", "light");
        // UI should update to Light label
        expect(screen.getByText(/Theme: Light/i)).toBeTruthy();
    });
});
