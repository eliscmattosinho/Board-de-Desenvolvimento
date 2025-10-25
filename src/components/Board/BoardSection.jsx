import React, { useState, useCallback } from "react";
import Column from "../Column/Column";
import AddColumnIndicator from "../Column/AddColIndicator/AddColumnIndicator";
import ConfirmDeleteModal from "../Card/DeleteTaskModal/ConfirmDeleteModal";
import "./BoardSection.css";
import { CiCirclePlus } from "react-icons/ci";
import { getDisplayStatus } from "../../js/boardUtils";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [colToDelete, setColToDelete] = useState(null);

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
              onRemove={() => {
                setColToDelete(col);
                setShowDeleteModal(true);
              }}
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

      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        type="column"
        onConfirm={() => {
          if (colToDelete) {
            removeColumn(activeView, colToDelete.id);
            setColToDelete(null);
          }
          setShowDeleteModal(false);
        }}
        onCancel={() => {
          setShowDeleteModal(false);
          setColToDelete(null);
        }}
      />
    </div>
  );
}

export default BoardSection;
