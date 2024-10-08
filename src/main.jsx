import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import "@shopify/polaris/build/esm/styles.css";

import { ConvexProvider, ConvexReactClient } from "convex/react";

import { AppProvider } from "@shopify/polaris";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <AppProvider>
        <App />
      </AppProvider>
    </ConvexProvider>
  </StrictMode>
);
