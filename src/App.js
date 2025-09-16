import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Building from "./pages/Building";
import Boards from "./pages/Boards";
import NotFound from "./pages/NotFound";
import RouteChangeTracker from "./components/RouteChangeTracker";

function App() {
  return (
    <Router basename="/Board-de-Desenvolvimento">
      <RouteChangeTracker>
        <div className="App">
          <div id="main">
            <Routes>
              <Route path="/" element={<Building />} />
              <Route path="/boards" element={<Boards />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </RouteChangeTracker>
    </Router>
  );
}

export default App;
