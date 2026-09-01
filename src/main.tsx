import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { installOgUrlSync } from "./ogUrl";
import "./styles.css";

installOgUrlSync();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
