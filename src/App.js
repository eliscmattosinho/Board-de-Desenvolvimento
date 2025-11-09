import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Building from "./pages/Building";
import Boards from "./pages/Boards";
import NotFound from "./pages/NotFound";
import ScreenBlockage from "./pages/ScreenBlockage";

import RouteChangeTracker from "./components/RouteChangeTracker";
import ToastProvider from "./components/ToastProvider/ToastProvider";

import { ThemeProvider } from "./context/ThemeContext";
import { ModalProvider } from "./context/ModalContext";
import { TasksProvider } from "./context/TasksContext";

import useScreenBlocker from "./hooks/useScreenBlocker";

function AppContent({ location }) {
  useScreenBlocker(480);

  return (
    <div id="main">
      <Routes location={location}>
        <Route path="/" element={<Building />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/block" element={<ScreenBlockage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <Router basename="/development-board">
          <RouteChangeTracker>
            {(location) => (
              <ModalProvider>
                <div className="App">
                  <AppContent location={location} />
                  <ToastProvider />
                </div>
              </ModalProvider>
            )}
          </RouteChangeTracker>
        </Router>
      </TasksProvider>
    </ThemeProvider>
  );
}

export default App;
