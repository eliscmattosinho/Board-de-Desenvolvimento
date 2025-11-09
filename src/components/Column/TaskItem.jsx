import React from "react";

function TaskItem({ task, onClick, onDragStart, onDrop, onDragOver, onDragLeave, dragPosition }) {
  return (
    <div
      id={task.id}
      className={`item task-item ${dragPosition === "above"
          ? "drag-over-above"
          : dragPosition === "below"
            ? "drag-over-below"
            : ""
        }`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <h3 className="item-title">{task.title}</h3>
      <p className="item-description">{task.description || "Sem descrição."}</p>
    </div>
  );
}

// React.memo para evitar re-renderizações desnecessárias
export default React.memo(TaskItem, (prev, next) => {
  return (
    prev.task.id === next.task.id &&
    prev.task.title === next.task.title &&
    prev.task.description === next.task.description &&
    prev.dragPosition === next.dragPosition
  );
});
