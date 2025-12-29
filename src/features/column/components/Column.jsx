import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import ColumnHeader from "./ColumnHeader";
import ColumnCards from "./ColumnCards";
import useColumn from "@column/hooks/useColumn";
import { useCardDrag } from "@board/context/CardDragContext";

import "./Column.css";

function Column({
  id,
  title,
  className,
  style,
  color,
  applyTo,
  cards,
  onCardClick,
  onAddCard,
  onEdit,
  onRemove,
}) {
  const { setDropTarget, isDraggingCard } = useCardDrag();

  const {
    colStyle,
    dragOverIndex,
    dragPosition,
    setDragOver,
    clearDragOver,
    handleAddCardClick,
    handleEditClick,
    handleRemoveClick,
  } = useColumn({
    id,
    onAddCard,
    onEdit,
    onRemove,
    style,
    color: color || style?.bg || "#EFEFEF",
    applyTo,
  });

  return (
    <div
      className={`board-col ${className ?? ""}`}
      id={id}
      style={{
        "--col-bg": colStyle.bg,
        "--col-border": colStyle.border,
        "--col-font": colStyle.color,
      }}
      onPointerEnter={() => {
        if (!isDraggingCard()) return;

        setDropTarget({
          columnId: id,
          position: "top",
        });
      }}
      onPointerLeave={() => {
        clearDragOver();
      }}
    >
      <ColumnHeader
        title={title}
        cardsLength={cards.length}
        onEdit={handleEditClick}
        onRemove={handleRemoveClick}
      />

      <div className="col-items">
        <ColumnCards
          cards={cards}
          dragOverIndex={dragOverIndex}
          dragPosition={dragPosition}
          onCardClick={onCardClick}
          onHoverCard={(cardId, position) => {
            if (!isDraggingCard()) return;

            setDragOver(cardId, position);
            setDropTarget({
              columnId: id,
              targetCardId: cardId,
              position,
            });
          }}
          onLeaveCard={clearDragOver}
        />

        {cards.length === 0 && isDraggingCard() && (
          <div className="card-placeholder active" />
        )}
      </div>

      {onAddCard && (
        <button className="add-card" onClick={handleAddCardClick}>
          <CiCirclePlus size={30} />
        </button>
      )}
    </div>
  );
}

export default React.memo(Column);
