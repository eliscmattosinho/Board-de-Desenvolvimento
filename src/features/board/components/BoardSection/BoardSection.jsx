import React, { useCallback, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";

import { useModal } from "@context/ModalContext";
import { useScreen } from "@context/ScreenContext";
import { useBoardContext } from "@board/context/BoardContext";

import { useBoardUI } from "@board/hooks/useBoardUI";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { useCardsByColumn } from "@board/hooks/useCardsByColumn";
import { useColumnHover } from "@board/hooks/useColumnHover";
import BoardColumns from "@board/components/BoardColumns";
import "./BoardSection.css";

function BoardSection() {
  const {
    activeBoard,
    activeBoardColumns,
    orderedCards,
    handleAddCard: createCardData,
  } = useBoardContext();

  const containerRef = useRef(null);

  const { handleOpenCardModal, handleDeleteColumn } = useBoardUI();
  const { handleAddColumn } = useColumnModal({ activeBoard });
  const { isTouch } = useScreen();
  const { isModalOpen } = useModal();
  const { hoveredIndex, onEnter, onLeave } = useColumnHover();

  const cardsByColumn = useCardsByColumn({
    columns: activeBoardColumns,
    cards: orderedCards,
    activeBoard,
  });

  const onAddCard = useCallback(
    (columnId) => {
      const newCard = createCardData(columnId);
      if (newCard) handleOpenCardModal(newCard);
    },
    [createCardData, handleOpenCardModal]
  );

  const onCardClick = useCallback(
    (card) => {
      handleOpenCardModal({ ...card, columnId: card.displayColumnId });
    },
    [handleOpenCardModal]
  );

  const handleEditColumn = useCallback(
    (index, col) => handleAddColumn(index, col),
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
        onCardClick={onCardClick}
        onAddCard={onAddCard}
        onEditColumn={handleEditColumn}
        onRemoveColumn={handleDeleteColumn}
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
