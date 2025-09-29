import React from "react";
import Column from "./Column/Column";
import { getDisplayStatus } from "../../js/boardUtils";

function BoardSection({ id, columns, tasks, onDrop, onDragOver, onTaskClick, onDragStart, activeView, isActive }) {
  return (
    <div id={id} className={`board ${id}-board ${isActive ? "active" : ""}`}>
      {columns.map((col) => {
        const filtered = tasks.filter(t => getDisplayStatus(t.status, activeView) === col.title);
        return (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            className={col.className}
            onDrop={onDrop}
            onDragOver={onDragOver}
            tasks={filtered}
            onTaskClick={onTaskClick}
            onDragStart={onDragStart}
          />
        );
      })}
    </div>
  );
}

export default BoardSection;
