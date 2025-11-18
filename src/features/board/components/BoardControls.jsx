import React from "react";
import { useBoardContext } from "@board/context/BoardContext";
import "./BoardControls.css";

function BoardControls({ activeView, setActiveView }) {
  const { boards } = useBoardContext();

  return (
    <div className="hub-boards">
      {boards.map((board) => (
        <button
          key={board.id}
          className={`btn btn-board title-thematic ${activeView === board.id ? "active" : ""
            }`}
          onClick={() => setActiveView(board.id)}
        >
          {board.title}
        </button>
      ))}
    </div>
  );
}

export default BoardControls;
