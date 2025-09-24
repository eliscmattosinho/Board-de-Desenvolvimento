import React from "react";

function TaskItem({ task, onClick, onDragStart }) {
  return (
    <div
      id={task.id}
      className="item task-item"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
    >
      <h3 className="item-title">{task.title}</h3>
      <p className="item-description">
        {task.description || "Sem descrição."}
      </p>
    </div>
  );
}

export default TaskItem;
