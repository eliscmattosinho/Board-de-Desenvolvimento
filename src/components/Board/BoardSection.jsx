import React, { useState, useCallback, useMemo } from "react";
import Column from "../Column/Column";
import AddColumnIndicator from "../Column/AddColIndicator/AddColumnIndicator";
import ConfirmDeleteModal from "../Modal/DeleteModal/ConfirmDeleteModal";
import { useModal } from "../../context/ModalContext";
import { CiCirclePlus } from "react-icons/ci";
import { getDisplayStatus } from "../../utils/boardUtils";
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
  const { openModal, closeModal } = useModal();

  const handleColumnHover = useCallback((action, index = null) => {
    if (action === "hoverEnter") setHoveredIndex(index);
    else if (action === "hoverLeave") setHoveredIndex(null);
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
    <div id={id} className={`board ${id}-board ${isActive ? "active" : ""}`}>
      {columns.map((col, index) => (
        <React.Fragment key={col.id}>
          <Column
            id={col.id}
            title={col.title}
            className={col.className}
            tasks={tasksByColumn[col.id]}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onTaskClick={onTaskClick}
            onDragStart={onDragStart}
            onAddTask={onAddTask}
            color={col.color}
            applyTo={col.applyTo}
            onEdit={handleEditColumn(index, col)}
            onRemove={handleRemoveColumn(col)}
          />

          {index < columns.length - 1 && (
            <div
              className="add-column-zone"
              onMouseEnter={() => handleColumnHover("hoverEnter", index)}
              onMouseLeave={() => handleColumnHover("hoverLeave")}
            >
              {hoveredIndex === index && (
                <AddColumnIndicator
                  onClick={(e) => handleAddColumnAt(index + 1, e)}
                />
              )}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Área para adicionar coluna no final */}
      <div className="col-add-last" onClick={() => onAddColumn(columns.length)}>
        <CiCirclePlus className="add-col plus-icon" size={30} />
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default BoardSection;
