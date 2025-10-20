import React, { useState, useCallback, useEffect } from "react";
import Column from "./Column/Column";
import AddColumnIndicator from "../Board/Column/AddColumnIndicator";
import "./BoardSection.css";
import { CiCirclePlus } from "react-icons/ci";
import { getDisplayStatus } from "../../js/boardUtils";

function BoardSection({ id, columns, tasks, onDrop, onDragOver, onTaskClick, onDragStart, onAddTask, onAddColumn, activeView, isActive, renameColumn, removeColumn }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [newColumnId, setNewColumnId] = useState(""); // ID fixo para a nova coluna

  // Gera o ID da nova coluna apenas uma vez
  useEffect(() => {
    setNewColumnId(`new-col-${Date.now()}`);
  }, []);

  const handleColumn = useCallback(
    (action, index = null) => {
      switch (action) {
        case "hoverEnter":
          setHoveredIndex(index);
          break;
        case "hoverLeave":
          setHoveredIndex(null);
          break;
        case "addColumn":
          if (onAddColumn) onAddColumn(index);
          break;
        default:
          console.warn(`Unhandled column action: ${action}`);
      }
    },
    [onAddColumn]
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
              onEdit={() => {
                const newTitle = prompt("Digite o novo nome da coluna", col.title);
                if (newTitle) renameColumn(activeView, col.id, newTitle);
              }}
              onRemove={() => removeColumn(activeView, col.id)}
            />

            {index < columns.length - 1 && (
              <div
                className="add-column-zone"
                onMouseEnter={() => handleColumn("hoverEnter", index)}
                onMouseLeave={() => handleColumn("hoverLeave")}
              >
                {hoveredIndex === index && (
                  <AddColumnIndicator
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColumn("addColumn", index + 1);
                    }}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Add end column */}
      <div
        className="col-add-last"
        onClick={() => handleColumn("addColumn", columns.length)}
      >
        <CiCirclePlus className="add-col" size={30} />
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default BoardSection;
