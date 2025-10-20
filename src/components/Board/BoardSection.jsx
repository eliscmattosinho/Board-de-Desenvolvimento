import React, { useState } from "react";
import Column from "./Column/Column";
import AddColumnIndicator from "../Board/Column/AddColumnIndicator";
import "./BoardSection.css";
import { CiCirclePlus } from "react-icons/ci";
import { getDisplayStatus } from "../../js/boardUtils";

function BoardSection({ id, columns, tasks, onDrop, onDragOver, onTaskClick, onDragStart, onAddTask, onAddColumn, activeView, isActive }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleAddColumn = (index) => {
    onAddColumn(index);
  };

  return (
    <div id={id} className={`board ${id}-board ${isActive ? "active" : ""}`}>
      {columns.map((col, index) => {
        const filtered = tasks.filter(
          (t) => getDisplayStatus(t.status, activeView) === col.title
        );

        return (
          <React.Fragment key={col.id}>
            <Column
              id={col.id}
              title={col.title}
              className={col.className}
              onDrop={onDrop}
              onDragOver={onDragOver}
              tasks={filtered}
              onTaskClick={onTaskClick}
              onDragStart={onDragStart}
              onAddTask={onAddTask}
            />

            {index < columns.length - 1 && (
              <div
                className="add-column-zone"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleAddColumn(index + 1)}
              >
                {hoveredIndex === index && (
                  <AddColumnIndicator onClick={() => handleAddColumn(index + 1)} />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Add end column */}
      <div className="col-add-last" onClick={() => handleAddColumn(columns.length)}>
        <CiCirclePlus className="add-col" size={30} />
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default BoardSection;
