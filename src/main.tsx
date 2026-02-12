// ============================================================================
// FILE: main.tsx
// PURPOSE: App entry point — mounts the React app into the DOM
// This file is referenced by index.html and is the first code that runs.
// ============================================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
