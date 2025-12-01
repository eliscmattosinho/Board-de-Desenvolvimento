import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";

import RouteChangeBoundary from "@components/RouteChangeTracker/RouteChangeBoundary";
import ToastProvider from "@components/ToastProvider/ToastProvider";
import TooltipPortal from "@components/TooltipPortal/TooltipPortal";

function App() {
  return (
    <AppProviders>
      <Router basename={import.meta.env.DEV ? "/" : "/development-hub"}>
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
