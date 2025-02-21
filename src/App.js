import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Building from "./pages/Building";
import Boards from "./pages/Boards";

function App() {
  return (
    <Router basename="/Board-de-Desenvolvimento">
      <div className="App">
        <div id="main">
          <Routes>
            <Route path="/" element={<Building />} />
            <Route path="/boards" element={<Boards />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
