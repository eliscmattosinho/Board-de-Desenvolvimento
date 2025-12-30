import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import ColumnHeader from "./ColumnHeader";
import ColumnCards from "./ColumnCards";
import useColumn from "@column/hooks/useColumn";

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
  const {
    colStyle,
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
          onCardClick={onCardClick}
        />
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
