import React from "react";
import { useBoardContext } from "@board/context/BoardContext";
import "./BoardControls.css";

function BoardControls({ activeView, setActiveView }) {
  const { boards } = useBoardContext();

  const getButtonClass = (board) => {
    const classes = ["btn", "btn-board", `btn-view-${board.id}`];
    if (activeView === board.id) classes.push("active");
    if (["kanban", "scrum"].includes(board.id)) classes.push("title-thematic");
    return classes.join(" ");
  };

  return (
    <div className="hub-boards">
      {boards.map((board) => (
        <button
          key={board.id}
          className={getButtonClass(board)}
          onClick={() => setActiveView(board.id)}
        >
          {board.title}
        </button>
      ))}
    </div>
  );
}

export default BoardControls;
