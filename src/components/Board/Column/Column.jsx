import React, { useState } from "react";
import TaskItem from "./TaskItem";
import { CiCirclePlus } from "react-icons/ci";
import "./Column.css";

function Column({ id, title, className, onDrop, onDragOver, tasks, onTaskClick, onDragStart }) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);

  const handleDropTask = (e, targetTaskId, position = null) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDragPosition(null);
    onDrop(e, id, targetTaskId, position);
  };

  const handleDragOverTask = (e, taskId) => {
    e.preventDefault();
    const bounding = e.currentTarget.getBoundingClientRect();
    const offset = e.clientY - bounding.top;
    const position = offset < bounding.height / 2 ? "above" : "below";
    setDragOverIndex(taskId);
    setDragPosition(position);
  };

  const handleDragLeaveTask = () => {
    setDragOverIndex(null);
    setDragPosition(null);
  };

  return (
    <div className={`col-board ${className}`} id={id}>
      <div
        className="title-col-board"
        onDrop={(e) => handleDropTask(e, null)}
        onDragOver={(e) => e.preventDefault()}
      >
        <h4 className={`col-title-board ${className.split(" ")[1]}`}>
          {title}<span className="task-counter">({tasks.length})</span>
        </h4>
      </div>

      <div className={`col-items ${className.split(" ")[1]}-items ${tasks.length === 0 ? "none" : ""}`}>
        {tasks.map((task) => (
          <React.Fragment key={task.id}>
            {dragOverIndex === task.id && dragPosition === "above" && (
              <div className="task-placeholder active"></div>
            )}

            <TaskItem
              task={task}
              onClick={onTaskClick}
              onDragStart={onDragStart}
              onDrop={(e) => handleDropTask(e, task.id, dragPosition)}
              onDragOver={(e) => handleDragOverTask(e, task.id)}
              onDragLeave={handleDragLeaveTask}
            />

            {dragOverIndex === task.id && dragPosition === "below" && (
              <div className="task-placeholder active"></div>
            )}
          </React.Fragment>
        ))}

        {/* Placeholder para coluna vazia */}
        {tasks.length === 0 && (
          <div className={`task-placeholder active`}></div>
        )}
      </div>

      {/* Ícone "+" se a coluna estiver vazia */}
      {tasks.length === 0 && (
        <div
          className="add-task"
          onDrop={(e) => handleDropTask(e, null)}
          onDragOver={(e) => e.preventDefault()}
        >
          <CiCirclePlus size={30} />
        </div>
      )}
    </div>
  );
}

export default Column;
