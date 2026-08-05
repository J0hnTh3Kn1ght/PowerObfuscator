import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ErrorBoundary } from "./ErrorBoundary";

import "./styles.css";

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
