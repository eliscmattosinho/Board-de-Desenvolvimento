import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Building from "./pages/Building";
import Boards from "./pages/Boards";
import NotFound from "./pages/NotFound";
import ScreenBlockage from "./pages/ScreenBlockage";

import RouteChangeTracker from "./components/RouteChangeTracker";
import { ThemeProvider } from "./context/ThemeContext";
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
      <Router basename="/development-board">
        <RouteChangeTracker>
          <div className="App">
            <AppContent />
          </div>
        </RouteChangeTracker>
      </Router>
    </ThemeProvider>
  );
}

export default App;
