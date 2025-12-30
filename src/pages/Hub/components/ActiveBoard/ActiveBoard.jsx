import React from "react";
import { SiCcleaner } from "react-icons/si";

import BoardSection from "@board/components/BoardSection/BoardSection";
import FloatingMenu from "@components/FloatingMenu/FloatingMenu";

import "./ActiveBoard.css";

export default function ActiveBoard({
  activeBoard,
  columns,
  orderedCards,
  title,
  cardCount,
  handlers,
}) {
  return (
    <article className="hub-active-board">
      <header className="board-header">
        <div className="board-title-container">
          <h3 id="board-title" className="title-thematic">
            {title}
            <span className="card-counter">({cardCount})</span>
          </h3>

          <FloatingMenu
            columns={columns}
            onAddCard={handlers.addCard}
            onAddColumn={handlers.addColumn}
          />
        </div>

        <button
          id="board-cleaner"
          className="board-icon clean-icon"
          onClick={handlers.clear}
          data-tooltip="Limpar tarefas"
        >
          <SiCcleaner size={25} />
        </button>
      </header>

      <div className="board-content">
        <BoardSection
          id={activeBoard}
          columns={columns}
          cards={orderedCards}
          onCardClick={handlers.onCardClick}
          onAddCard={handlers.addCard}
          onAddColumn={handlers.addColumn}
          removeColumn={handlers.removeColumn}
          activeBoard={activeBoard}
          isActive
        />
      </div>
    </article>
  );
}
