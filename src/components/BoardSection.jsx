import React from "react";
import Column from "./Column";

function BoardSection({ id, columns, onDrop, onDragOver, tasks, onTaskClick, onDragStart, statusMap, isActive }) {
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
                    tasks={tasks.filter((t) => statusMap[t.status] === col.title)}
                    onTaskClick={onTaskClick}
                    onDragStart={onDragStart}
                    statusMap={statusMap}
                />
            ))}
        </div>
    );
}

export default BoardSection;
