import React from "react";
import Column from "@column/components/Column";
import AddColumnIndicator from "@column/components/AddColIndicator/AddColumnIndicator";

function BoardColumns({
    columns,
    cardsByColumn,
    isTouch,
    isModalOpen,
    hoveredIndex,
    onHoverEnter,
    onHoverLeave,
    onAddColumnAt,
    onCardClick,
    onAddCard,
    onEditColumn,
    onRemoveColumn,
}) {
    return columns.map((col, index) => (
        <React.Fragment key={col.id}>
            <Column
                {...col}
                cards={cardsByColumn[col.id] || []}
                onCardClick={onCardClick}
                onAddCard={onAddCard}
                onEdit={onEditColumn(index, col)}
                onRemove={onRemoveColumn(col)}
            />

            {!isTouch && index < columns.length - 1 && (
                <div
                    className="add-column-zone"
                    onMouseEnter={() => onHoverEnter(index)}
                    onMouseLeave={onHoverLeave}
                >
                    {hoveredIndex === index && (
                        <AddColumnIndicator
                            onClick={(e) => onAddColumnAt(index + 1, e)}
                            isBlocked={isModalOpen}
                        />
                    )}
                </div>
            )}
        </React.Fragment>
    ));
}

export default React.memo(BoardColumns);
