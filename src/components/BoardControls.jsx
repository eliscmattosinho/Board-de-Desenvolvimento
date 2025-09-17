import React from "react";

function BoardControls({ activeView, setActiveView }) {
  return (
    <div className="btns-block">
      <button
        className={`btn btn-kanban ${activeView === "kanban" ? "active" : ""}`}
        onClick={() => setActiveView("kanban")}
      >
        <p className="btn-title">Kanban</p>
      </button>
      <button
        className={`btn btn-scrum ${activeView === "scrum" ? "active" : ""}`}
        onClick={() => setActiveView("scrum")}
      >
        <p className="btn-title">Scrum</p>
      </button>
    </div>
  );
}

export default BoardControls;
