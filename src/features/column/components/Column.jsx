import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import ColumnHeader from "./ColumnHeader";
import ColumnCards from "./ColumnCards";
import useColumn from "@column/hooks/useColumn";
import { useBoardLogic } from "@board/hooks/useBoardLogic";

import "./Column.css";

function Column({ columnData, index }) {
  const { onAddCard, handleEditColumn, handleDeleteColumn } = useBoardLogic();
  const { id, title, style, color, applyTo, isTemplate, className } = columnData;

  const { colStyle, handleAddCardClick, handleEditClick, handleRemoveClick } =
    useColumn({
      id,
      index,
      columnData,
      onAddCard,
      onEdit: handleEditColumn,
      onRemove: handleDeleteColumn,
      style,
      color: color || style?.bg || "#EFEFEF",
      applyTo,
      isTemplate,
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
        id={id}
        title={title}
        textColor={colStyle.color}
        onEdit={handleEditClick}
        onRemove={handleRemoveClick}
      />

      <div className="col-items">
        <ColumnCards columnId={id} />
      </div>

      {onAddCard && (
        <button
          type="button"
          className="add-card"
          onClick={handleAddCardClick}
          aria-label={`Adicionar novo card em ${title}`}
        >
          <CiCirclePlus size={30} />
        </button>
      )}
    </div>
  );
}

export default React.memo(Column);
