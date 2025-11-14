import React from "react";
import "./TaskItem.css"

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
      onDragStart={(e) => {
        onDragStart(e, task.id);

        // CriA clone invisível para drag image
        const dragImage = e.currentTarget.cloneNode(true);
        dragImage.style.position = "absolute";
        dragImage.style.top = "-1000px";
        dragImage.style.left = "-1000px";
        dragImage.style.width = `${e.currentTarget.offsetWidth}px`;
        document.body.appendChild(dragImage);

        e.dataTransfer.setDragImage(dragImage, e.nativeEvent.offsetX, e.nativeEvent.offsetY);

        // Remove o clone após o drag começar
        setTimeout(() => document.body.removeChild(dragImage), 0);
      }}
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
