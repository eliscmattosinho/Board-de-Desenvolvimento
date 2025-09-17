import React from "react";
import Column from "./Column";
import { getDisplayStatus } from "../js/boardUtils";

function BoardSection({ id, columns, tasks, onDrop, onDragOver, onTaskClick, onDragStart, activeView, isActive }) {
  return (
    <div id={id} className={`board ${id}-board ${isActive ? 'active' : ''}`}>
      {columns.map((col) => (
        <Column
          key={col.id}
          id={col.id}
          title={col.title}
          className={col.className}
          onDrop={onDrop}
          onDragOver={onDragOver}
          tasks={tasks.filter(t => getDisplayStatus(t.status, activeView) === col.title)}
          onTaskClick={onTaskClick}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}

export default BoardSection;
