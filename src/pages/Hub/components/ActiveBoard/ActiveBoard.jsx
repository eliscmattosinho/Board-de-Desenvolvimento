import React from "react";
import { SiCcleaner } from "react-icons/si";
import { useBoardContext } from "@board/context/BoardContext";
import BoardSection from "@board/components/BoardSection/BoardSection";
import FloatingMenu from "@components/FloatingMenu/FloatingMenu";

import "./ActiveBoard.css";

export default function ActiveBoard() {
  const {
    activeBoardColumns,
    activeBoardTitle,
    activeBoardCardCount,
    handleAddCard,
    handleAddColumn,
    handleClearBoard,
  } = useBoardContext();

  return (
    <article className="hub-active-board">
      <header className="board-header">
        <div className="board-title-container">
          <h3 id="board-title" className="title-thematic">
            {activeBoardTitle ?? "Board"}
            <span className="card-counter">({activeBoardCardCount ?? 0})</span>
          </h3>

          <FloatingMenu
            columns={activeBoardColumns}
            onAddCard={handleAddCard}
            onAddColumn={handleAddColumn}
          />
        </div>

        <button
          id="board-cleaner"
          className="board-icon clean-icon"
          onClick={handleClearBoard}
          data-tooltip="Limpar tarefas"
        >
          <SiCcleaner size={25} />
        </button>
      </header>

      <div className="board-content">
        <BoardSection />
      </div>
    </article>
  );
}