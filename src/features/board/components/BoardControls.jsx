import React from "react";
import "./BoardControls.css"

function BoardControls({ activeView, setActiveView }) {
  return (
    <div className="hub-boards">
      {/* Default - Kanban */}
      <button
        id="btn-kanban"
        className={`btn btn-board ${activeView === "kanban" ? "active" : ""}`}
        onClick={() => setActiveView("kanban")}
      >
        <p className="title-thematic">Kanban</p>
      </button>
  
      {/* Default - Scrum */}
      <button
        id="btn-scrum"
        className={`btn btn-board ${activeView === "scrum" ? "active" : ""}`}
        onClick={() => setActiveView("scrum")}
      >
        <p className="title-thematic">Scrum</p>
      </button>

      {/* Custom - New */}

    </div>
  );
}

export default BoardControls;
