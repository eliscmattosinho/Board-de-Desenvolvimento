import React from "react";
import Column from "@column/components/Column";
import AddColumnIndicator from "@column/components/AddColIndicator/AddColumnIndicator";
import { useBoardLogic } from "@board/hooks/useBoardLogic";

function BoardColumns() {
  const {
    activeBoardColumns,
    cardsByColumn,
    isTouch,
    isModalOpen,
    hoveredIndex,
    onEnter,
    onLeave,
    handleAddColumnAt,
    onCardClick,
    onAddCard,
    handleEditColumn,
    handleDeleteColumn,
  } = useBoardLogic();

  if (!activeBoardColumns) return null;

  return activeBoardColumns.map((col, index) => (
    <React.Fragment key={col.id}>
      <Column
        {...col}
        cards={cardsByColumn[col.id] || []}
        onCardClick={onCardClick}
        onAddCard={onAddCard}
        onEdit={() => handleEditColumn(index, col)}
        onRemove={() => handleDeleteColumn(col)}
      />

      {!isTouch && index < activeBoardColumns.length - 1 && (
        <div
          className="add-column-zone"
          onMouseEnter={() => onEnter(index)}
          onMouseLeave={onLeave}
        >
          {hoveredIndex === index && (
            <AddColumnIndicator
              onClick={(e) => handleAddColumnAt(index + 1, e)}
              isBlocked={isModalOpen}
            />
          )}
        </div>
      )}
    </React.Fragment>
  ));
}

export default React.memo(BoardColumns);
