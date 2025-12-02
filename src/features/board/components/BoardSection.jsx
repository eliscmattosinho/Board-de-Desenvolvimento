import React, { useState, useCallback, useMemo } from "react";
import { CiCirclePlus } from "react-icons/ci";

import { getDisplayStatus } from "@board/components/templates/templateMirror";
import { useBoardPanning } from "@board/hooks/useBoardPanning";
import { useModal } from "@context/ModalContext";
import { useScreen } from "@context/ScreenContext";

import Column from "@column/components/Column";
import AddColumnIndicator from "@column/components/AddColIndicator/AddColumnIndicator";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";

import "./BoardSection.css";

function BoardSection({
  id,
  columns,
  tasks,
  onDrop,
  onDragOver,
  onTaskClick,
  onDragStart,
  onAddTask,
  onAddColumn,
  removeColumn,
  activeView,
  isActive,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { openModal, closeModal, isModalOpen } = useModal();
  const { isTouch } = useScreen();

  const { bind, setDraggingCard } = useBoardPanning({ containerId: id });

  const handleCardDragStart = (...args) => {
    setDraggingCard(true);
    onDragStart && onDragStart(...args);
  };

  const handleCardDragEnd = () => setDraggingCard(false);

  const handleColumnHover = useCallback((action, index = null) => {
    setHoveredIndex(action === "hoverEnter" ? index : null);
  }, []);

  const handleDeleteColumn = useCallback(
    (col) => {
      openModal(ConfirmDeleteModal, {
        type: "column",
        onConfirm: () => {
          removeColumn(activeView, col.id);
          closeModal();
        },
        onCancel: closeModal,
      });
    },
    [removeColumn, activeView, openModal, closeModal]
  );

  const tasksByColumn = useMemo(() => {
    const map = {};
    columns.forEach((col) => {
      map[col.id] = tasks.filter(
        (t) => getDisplayStatus(t.status, activeView) === col.title
      );
    });
    return map;
  }, [tasks, columns, activeView]);

  const handleEditColumn = useCallback(
    (index, col) => () => onAddColumn(index, col),
    [onAddColumn]
  );

  const handleRemoveColumn = useCallback(
    (col) => () => handleDeleteColumn(col),
    [handleDeleteColumn]
  );

  const handleAddColumnAt = useCallback(
    (index, e) => {
      if (e) e.stopPropagation();
      onAddColumn(index);
    },
    [onAddColumn]
  );

  return (
    <div
      id={id}
      className={`board-container ${id}-board ${isActive ? "active" : ""}`}
      {...(!isTouch ? bind : {})}
    >
      {columns.map((col, index) => (
        <React.Fragment key={col.id}>
          <Column
            id={col.id}
            title={col.title}
            className={col.className}
            style={col.style}
            tasks={tasksByColumn[col.id] || []}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onTaskClick={onTaskClick}
            onDragStart={handleCardDragStart}
            onDragEnd={handleCardDragEnd}
            onAddTask={onAddTask}
            onEdit={handleEditColumn(index, col)}
            onRemove={handleRemoveColumn(col)}
          />

          {!isTouch && index < columns.length - 1 && (
            <div
              className="add-column-zone"
              onMouseEnter={() => handleColumnHover("hoverEnter", index)}
              onMouseLeave={() => handleColumnHover("hoverLeave")}
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
      ))}

      <div className="col-add-last">
        <button className="add-col" onClick={() => onAddColumn(columns.length)}>
          <CiCirclePlus className="plus-icon" size={30} />
        </button>
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default BoardSection;
