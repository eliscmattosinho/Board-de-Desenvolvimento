import React, { useCallback, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";

import { useModal } from "@context/ModalContext";
import { useScreen } from "@context/ScreenContext";

import { useCardsByColumn } from "@board/hooks/useCardsByColumn";
import { useColumnHover } from "@board/hooks/useColumnHover";
import { useDeleteColumn } from "@board/hooks/useDeleteColumn";

import BoardColumns from "@board/components/BoardColumns";

import "./BoardSection.css";

function BoardSection({
  id,
  columns,
  cards,
  onCardClick,
  onAddCard,
  onAddColumn,
  removeColumn,
  activeBoard,
  isActive,
}) {
  const containerRef = useRef(null);

  const { isTouch } = useScreen();
  const { isModalOpen } = useModal();

  const { hoveredIndex, onEnter, onLeave } = useColumnHover();
  const deleteColumn = useDeleteColumn({ removeColumn, activeBoard });

  const cardsByColumn = useCardsByColumn({
    columns,
    cards,
    activeBoard,
  });

  const handleEditColumn = useCallback(
    (index, col) => () => onAddColumn(index, col),
    [onAddColumn]
  );

  const handleRemoveColumn = useCallback(
    (col) => () => deleteColumn(col),
    [deleteColumn]
  );

  const handleAddColumnAt = useCallback(
    (index, e) => {
      e?.stopPropagation();
      onAddColumn(index);
    },
    [onAddColumn]
  );

  return (
    <div
      ref={containerRef}
      id={id}
      className={`board-container ${id}-board ${isActive ? "active" : ""}`}
    >
      <BoardColumns
        columns={columns}
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
        onRemoveColumn={handleRemoveColumn}
      />

      <div className="col-add-last">
        <button
          className="add-col"
          onClick={() => onAddColumn(columns.length)}
        >
          <CiCirclePlus className="plus-icon" size={30} />
        </button>
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default React.memo(BoardSection);
