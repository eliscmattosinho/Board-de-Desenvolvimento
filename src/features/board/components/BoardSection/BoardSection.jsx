import React, { useCallback, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";

import { useModal } from "@context/ModalContext";
import { useScreen } from "@context/ScreenContext";
import { useBoardContext } from "@board/context/BoardContext";

import { useCardsByColumn } from "@board/hooks/useCardsByColumn";
import { useColumnHover } from "@board/hooks/useColumnHover";
import { useDeleteColumn } from "@board/hooks/useDeleteColumn";

import BoardColumns from "@board/components/BoardColumns";
import "./BoardSection.css";

function BoardSection() {
  const { 
    activeBoard, 
    activeBoardColumns, 
    orderedCards, 
    handleCardClick,
    handleAddCard,
    handleAddColumn,
    removeColumn 
  } = useBoardContext();

  const containerRef = useRef(null);
  const { isTouch } = useScreen();
  const { isModalOpen } = useModal();

  const { hoveredIndex, onEnter, onLeave } = useColumnHover();

  const deleteColumn = useDeleteColumn(); 

  const cardsByColumn = useCardsByColumn({
    columns: activeBoardColumns,
    cards: orderedCards,
    activeBoard,
  });

  const handleEditColumn = useCallback(
    (index, col) => () => handleAddColumn(index, col),
    [handleAddColumn]
  );

  const handleAddColumnAt = useCallback(
    (index, e) => {
      e?.stopPropagation();
      handleAddColumn(index);
    },
    [handleAddColumn]
  );

  return (
    <div
      ref={containerRef}
      className={`board-container ${activeBoard}-board active`}
    >
      <BoardColumns
        columns={activeBoardColumns}
        cardsByColumn={cardsByColumn}
        isTouch={isTouch}
        isModalOpen={isModalOpen}
        hoveredIndex={hoveredIndex}
        onHoverEnter={onEnter}
        onHoverLeave={onLeave}
        onAddColumnAt={handleAddColumnAt}
        onCardClick={handleCardClick}
        onAddCard={handleAddCard}
        onEditColumn={handleEditColumn}
        onRemoveColumn={(col) => () => deleteColumn(col)}
      />

      <div className="col-add-last">
        <button
          className="add-col"
          onClick={() => handleAddColumn(activeBoardColumns.length)}
        >
          <CiCirclePlus className="plus-icon" size={30} />
        </button>
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default React.memo(BoardSection);