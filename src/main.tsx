import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

import App from "./App";
import { CalvesProvider } from "./lib/calves-store";
import { RouterProvider } from "./lib/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider>
      <CalvesProvider>
        <App />
      </CalvesProvider>
    </RouterProvider>
  </StrictMode>,
);
