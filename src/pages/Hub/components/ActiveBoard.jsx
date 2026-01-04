import React, { memo } from "react";
import { SiCcleaner } from "react-icons/si";
import { useBoardContext } from "@board/context/BoardContext";
import { useBoardUI } from "@board/hooks/useBoardUI";
import BoardSection from "@board/components/BoardSection/BoardSection";
import FloatingMenu from "@components/FloatingMenu/FloatingMenu";

const ActiveBoard = memo(() => {
  const { activeBoard, activeBoardTitle, activeBoardCardCount } =
    useBoardContext();
  const { handleClearBoard, canClear } = useBoardUI();

  if (!activeBoard) return null;

  return (
    <article className="hub-active-board">
      <header className="board-header">
        <div className="board-title-container">
          <h3 className="title-thematic">
            {activeBoardTitle ?? "Board"}
            <span className="card-counter">({activeBoardCardCount ?? 0})</span>
          </h3>
          <FloatingMenu />
        </div>

        <button
          type="button"
          className={`board-icon clean-icon ${!canClear ? "is-empty" : ""}`}
          onClick={handleClearBoard}
          data-tooltip="Limpar tarefas"
          aria-label="Limpar tarefas"
        >
          <SiCcleaner size={25} />
        </button>
      </header>

      <div className="board-content">
        <BoardSection />
      </div>
    </article>
  );
});

export default ActiveBoard;
