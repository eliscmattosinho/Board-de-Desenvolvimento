import React, { useState } from "react";
import TaskItem from "./TaskItem";
import { CiCirclePlus, CiEdit, CiTrash } from "react-icons/ci";
import { columnStyles } from "../../constants/columnStyles.js";
import "./Column.css";

function Column({
  id,
  title,
  className,
  onDrop,
  onDragOver,
  tasks,
  onTaskClick,
  onDragStart,
  onAddTask,
  onEdit,
  onRemove,
  color,
  applyTo
}) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [hovered, setHovered] = useState(false);

  const colKey = className.split(" ")[1];
  const defaultStyle = columnStyles[colKey] || { bg: "transparent", border: "transparent" };

  // Se o usuário definiu uma cor, usa ela; senão usa o padrão
  const colStyle = {
    bg: applyTo === "fundo" && color ? color : defaultStyle.bg,
    border: applyTo === "borda" && color ? color : defaultStyle.border,
  };

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
    <div
      className={`col-board ${className}`}
      id={id}
      style={{
        "--col-bg": colStyle.bg,
        "--col-border": colStyle.border,
      }}
    >
      <div
        className="title-col-board"
        onDrop={(e) => handleDropTask(e, null)}
        onDragOver={(e) => e.preventDefault()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="col-title-flex">
          {hovered && onRemove && (
            <CiTrash
              className="col-icon-left"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            />
          )}

          <h4 className="col-title-board">
            {title} <span className="task-counter">({tasks.length})</span>
          </h4>

          {hovered && onEdit && (
            <CiEdit
              className="col-icon-right"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            />
          )}
        </div>
      </div>

      {/* Lista de tarefas */}
      <div className={`col-items ${colKey}-items ${tasks.length === 0 ? "none" : ""}`}>
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

        {tasks.length === 0 && <div className="task-placeholder active"></div>}
      </div>

      {onAddTask && (
        <div className="add-task" onClick={() => onAddTask(id)}>
          <CiCirclePlus
            size={30}
            className="board-icon"
          />
        </div>
      )}

      <div
        className="drop-zone"
        onDrop={(e) => handleDropTask(e, null)}
        onDragOver={(e) => e.preventDefault()}
      />
    </div>
  );
}

export default Column;
