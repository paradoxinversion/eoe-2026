import { useEffect, useRef } from "react";
import { saveConfig } from "../services/persistence";
import type { Config } from "../config/schema";

type UseAutosaveOpts = {
    name: string;
    intervalSeconds?: number;
};

export function useAutosave(data: Config, opts: UseAutosaveOpts) {
    const { name, intervalSeconds = 30 } = opts;
    const dataRef = useRef(data);
    dataRef.current = data;

    useEffect(() => {
        let mounted = true;
        const save = async () => {
            try {
                await saveConfig(name, dataRef.current);
            } catch (e) {
                // swallow errors here; callers may surface via UI
                // could emit to telemetry in future
            }
        };

        const id = setInterval(
            () => {
                if (mounted) save();
            },
            Math.max(1000, intervalSeconds * 1000),
        );

        const onVisibility = () => {
            if (document.visibilityState === "hidden") {
                // save immediately when user switches away
                void save();
            }
        };

        window.addEventListener("visibilitychange", onVisibility);

        // save once on mount
        void save();

        return () => {
            mounted = false;
            clearInterval(id);
            window.removeEventListener("visibilitychange", onVisibility);
            // final save on unmount
            void save();
        };
    }, [name, intervalSeconds]);
}

export default useAutosave;
