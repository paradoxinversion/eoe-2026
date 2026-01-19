import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Dashboard from "../../frontend/src/pages/Dashboard/index";

describe("Dashboard tabs", () => {
    it("renders tabs and switches content", () => {
        render(<Dashboard />);

        // Main tab should be visible
        expect(screen.getByRole("tab", { name: /Main/i })).toBeTruthy();
        expect(screen.getByText(/Main/)).toBeTruthy();

        // Click Settings tab and expect Settings content
        const settingsTab = screen.getByRole("tab", { name: /Settings/i });
        fireEvent.click(settingsTab);
        expect(screen.getByText(/Settings/)).toBeTruthy();
    });
});
/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";

describe("Dashboard tabs", () => {
    beforeEach(() => {
        vi.resetModules();
        // mock persistence used by Main so tests don't hit IndexedDB
        vi.doMock("../../frontend/src/services/persistence", () => ({
            listGameStates: vi.fn().mockResolvedValue([]),
            loadGameState: vi.fn().mockResolvedValue(null),
        }));
        // mock turn service to avoid alerts during test
        vi.doMock("../../frontend/src/services/turn", () => ({
            advanceTurn: vi.fn().mockResolvedValue(undefined),
        }));
    });

    it("renders tabs and switches content", async () => {
        const { default: Dashboard } =
            await import("../../frontend/src/pages/Dashboard/index");
        render(React.createElement(Dashboard));

        // tabs should be present
        expect(screen.getByRole("tab", { name: /Main/i })).toBeTruthy();
        expect(screen.getByRole("tab", { name: /Intel/i })).toBeTruthy();
        expect(screen.getByRole("tab", { name: /Settings/i })).toBeTruthy();

        // Main content visible by default
        await waitFor(() => expect(screen.getByText(/Main/i)).toBeTruthy());

        // Switch to Intel tab
        const intelTab = screen.getByRole("tab", { name: /Intel/i });
        fireEvent.click(intelTab);

        // Intel stub content should appear
        await waitFor(() =>
            expect(screen.getByText(/Intel \(stub\)/i)).toBeTruthy(),
        );
    });
});
