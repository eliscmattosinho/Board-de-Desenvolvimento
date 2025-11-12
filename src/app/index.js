import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./index.css";
import "./App.css";

import reportWebVitals from "./reportWebVitals";

const params = new URLSearchParams(window.location.search);
if (params.get("redirect")) {
  const redirectPath = params.get("redirect");
  window.history.replaceState(null, "", redirectPath);
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
