import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";

import RouteChangeBoundary from "@components/RouteChangeTracker/RouteChangeBoundary";
import ToastProvider from "@components/ToastProvider/ToastProvider";
import TooltipPortal from "@components/TooltipPortal/TooltipPortal";

import { resetStorageOnReload } from "@utils/storageUtils";

resetStorageOnReload();

function App() {
  const baseName = import.meta.env.DEV ? "/" : "/development-hub";

  return (
    <AppProviders>
      <Router basename={baseName}>
        <RouteChangeBoundary>
          <div className="App">
            <AppRoutes />
            <ToastProvider />
            <TooltipPortal />
          </div>
        </RouteChangeBoundary>
      </Router>
    </AppProviders>
  );
}

export default App;
