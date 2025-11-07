import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Building from "./pages/Building";
import Boards from "./pages/Boards";
import NotFound from "./pages/NotFound";
import ScreenBlockage from "./pages/ScreenBlockage";

import RouteChangeTracker from "./components/RouteChangeTracker";
import { ThemeProvider } from "./context/ThemeContext";
import { TasksProvider } from "./context/TasksContext";
import ToastProvider from "./components/ToastProvider/ToastProvider";

import useScreenBlocker from "./hooks/useScreenBlocker";

function AppContent() {
  useScreenBlocker(480);

  return (
    <div id="main">
      <Routes>
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
            <div className="App">
              <AppContent />
              <ToastProvider />
            </div>
          </RouteChangeTracker>
        </Router>
      </TasksProvider>
    </ThemeProvider>
  );
}

export default App;
