import React from "react";

function BoardControls({ activeView, setActiveView }) {
  return (
    <div className="btns-block">
      <button
        className={`btn btn-project light btn-board light btn-kanban ${activeView === "kanban" ? "active" : ""}`}
        onClick={() => setActiveView("kanban")}
      >
        <p className="title-thematic">Kanban</p>
      </button>
      <button
        className={`btn btn-project light btn-board light btn-scrum ${activeView === "scrum" ? "active" : ""}`}
        onClick={() => setActiveView("scrum")}
      >
        <p className="title-thematic">Scrum</p>
      </button>
    </div>
  );
}

export default BoardControls;
