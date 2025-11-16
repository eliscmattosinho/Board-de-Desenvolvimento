import React from "react";
import "./BoardControls.css"

function BoardControls({ activeView, setActiveView }) {
  return (
    <div className="hub-boards">
      {/* Default - Kanban */}
      <button
        id="btn-kanban"
        className={`btn btn-board title-thematic ${activeView === "kanban" ? "active" : ""}`}
        onClick={() => setActiveView("kanban")}
      >
        Kanban
      </button>
  
      {/* Default - Scrum */}
      <button
        id="btn-scrum"
        className={`btn btn-board title-thematic ${activeView === "scrum" ? "active" : ""}`}
        onClick={() => setActiveView("scrum")}
      >
        Scrum
      </button>

      {/* Custom - New */}

    </div>
  );
}

export default BoardControls;
