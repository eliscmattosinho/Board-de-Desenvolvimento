import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Building from "@pages/Building";
import Hub from "@pages/Hub";
import NotFound from "@pages/NotFound";

import RouteChangeTracker from "@components/RouteChangeTracker";
import ToastProvider from "@components/ToastProvider/ToastProvider";

import { ThemeProvider } from "@context/ThemeContext";
import { ModalProvider } from "@context/ModalContext";
import { TaskProvider } from "@task/context/TaskProvider";
import { ScreenProvider } from "@context/ScreenContext";

import { BoardProvider } from "@board/context/BoardContext";

import TooltipPortal from "@components/TooltipPortal/TooltipPortal";

function AppContent({ location }) {
  return (
    <div id="main">
      <Routes location={location}>
        <Route path="/" element={<Building />} />

        <Route
          path="/hub"
          element={
            <BoardProvider>
              <Hub />
            </BoardProvider>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <ScreenProvider>
          <Router basename={import.meta.env.DEV ? "/" : "/development-hub"}>
            <RouteChangeTracker>
              {(location) => (
                <ModalProvider>
                  <div className="App">
                    <AppContent location={location} />
                    <ToastProvider />
                    <TooltipPortal />
                  </div>
                </ModalProvider>
              )}
            </RouteChangeTracker>
          </Router>
        </ScreenProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
