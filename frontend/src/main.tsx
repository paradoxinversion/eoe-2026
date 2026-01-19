import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./styles.css";

const container = document.getElementById("root");
if (!container) {
  // Avoid throwing in environments where 'root' is absent (safer for embed/tests)
  // eslint-disable-next-line no-console
  console.error("Root container not found — skipping render.");
} else {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
