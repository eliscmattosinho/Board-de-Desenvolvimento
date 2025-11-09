import React, { useState, useCallback } from "react";
import Column from "../Column/Column";
import AddColumnIndicator from "../Column/AddColIndicator/AddColumnIndicator";
import ConfirmDeleteModal from "../Modal/DeleteModal/ConfirmDeleteModal";
import { useModal } from "../../context/ModalContext";
import "./BoardSection.css";
import { CiCirclePlus } from "react-icons/ci";
import { getDisplayStatus } from "../../utils/boardUtils";

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

  const handleColumnHover = useCallback(
    (action, index = null) => {
      switch (action) {
        case "hoverEnter":
          setHoveredIndex(index);
          break;
        case "hoverLeave":
          setHoveredIndex(null);
          break;
        default:
          console.warn(`Unhandled column hover action: ${action}`);
      }
    },
    []
  );

  const handleDeleteColumn = (col) => {
    openModal(ConfirmDeleteModal, {
      type: "column",
      onConfirm: () => {
        removeColumn(activeView, col.id);
        closeModal();
      },
      onCancel: closeModal,
    });
  };

  return (
    <div id={id} className={`board ${id}-board ${isActive ? "active" : ""}`}>
      {columns.map((col, index) => {
        const filteredTasks = tasks.filter(
          (t) => getDisplayStatus(t.status, activeView) === col.title
        );

        return (
          <React.Fragment key={col.id}>
            <Column
              id={col.id}
              title={col.title}
              className={col.className}
              tasks={filteredTasks}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onTaskClick={onTaskClick}
              onDragStart={onDragStart}
              onAddTask={onAddTask}
              color={col.color}
              applyTo={col.applyTo}
              onEdit={() => onAddColumn(index, col)}
              onRemove={() => handleDeleteColumn(col)}
            />

            {index < columns.length - 1 && (
              <div
                className="add-column-zone"
                onMouseEnter={() => handleColumnHover("hoverEnter", index)}
                onMouseLeave={() => handleColumnHover("hoverLeave")}
              >
                {hoveredIndex === index && (
                  <AddColumnIndicator
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddColumn(index + 1);
                    }}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Área para adicionar coluna no final */}
      <div className="col-add-last" onClick={() => onAddColumn(columns.length)}>
        <CiCirclePlus className="add-col" size={30} />
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default BoardSection;
