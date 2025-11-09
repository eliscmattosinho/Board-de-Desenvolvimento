import React, { useState, useCallback, useMemo } from "react";
import { CiCirclePlus, CiEdit, CiTrash } from "react-icons/ci";
import TaskItem from "./TaskItem";
import { columnStyles } from "../../constants/columnStyles";
import "./Column.css";

const ColumnHeader = React.memo(({ title, tasksLength, onEdit, onRemove }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="title-col-board"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="col-title-flex">
        {hovered && onRemove && (
          <CiTrash className="col-icon-left" size={20} onClick={onRemove} />
        )}
        <h4 className="col-title-board">
          {title} <span className="task-counter">({tasksLength})</span>
        </h4>
        {hovered && onEdit && (
          <CiEdit className="col-icon-right" size={20} onClick={onEdit} />
        )}
      </div>
    </div>
  );
});

function Column({
  id,
  title,
  className,
  onDrop,
  tasks,
  onTaskClick,
  onDragStart,
  onAddTask,
  onEdit,
  onRemove,
  color,
  applyTo,
}) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);

  const colKey = className.split(" ")[1];
  const defaultStyle = columnStyles[colKey] || { bg: "transparent", border: "transparent" };

  const colStyle = {
    bg: applyTo === "fundo" && color ? color : defaultStyle.bg,
    border: applyTo === "borda" && color ? color : defaultStyle.border,
    color:
      applyTo === "fundo"
        ? "#efefef"
        : applyTo === "borda" && color
          ? color
          : defaultStyle.color,
  };

  const handleDropTask = useCallback(
    (e, targetTaskId = null, position = null) => {
      e.preventDefault();
      setDragOverIndex(null);
      setDragPosition(null);
      onDrop(e, id, targetTaskId, position);
    },
    [id, onDrop]
  );

  const handleDragOverTask = useCallback((e, taskId) => {
    e.preventDefault();
    const bounding = e.currentTarget.getBoundingClientRect();
    const offset = e.clientY - bounding.top;
    const position = offset < bounding.height / 2 ? "above" : "below";
    setDragOverIndex(taskId);
    setDragPosition(position);
  }, []);

  const handleDragLeaveTask = useCallback(() => {
    setDragOverIndex(null);
    setDragPosition(null);
  }, []);

  const handleAddTaskClick = useCallback(() => onAddTask(id), [id, onAddTask]);
  const handleEditClick = useCallback(
    (e) => {
      e.stopPropagation();
      onEdit?.();
    },
    [onEdit]
  );
  const handleRemoveClick = useCallback(
    (e) => {
      e.stopPropagation();
      onRemove?.();
    },
    [onRemove]
  );

  const renderedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;

    return tasks.map((task) => (
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
          dragPosition={dragOverIndex === task.id ? dragPosition : null}
        />

        {dragOverIndex === task.id && dragPosition === "below" && (
          <div className="task-placeholder active"></div>
        )}
      </React.Fragment>
    ));
  }, [
    tasks,
    dragOverIndex,
    dragPosition,
    onTaskClick,
    onDragStart,
    handleDropTask,
    handleDragOverTask,
    handleDragLeaveTask,
  ]);

  return (
    <div
      className={`col-board ${className}`}
      id={id}
      style={{
        "--col-bg": colStyle.bg,
        "--col-border": colStyle.border,
        "--col-font": colStyle.color,
      }}
    >
      <ColumnHeader
        title={title}
        tasksLength={tasks.length}
        onEdit={handleEditClick}
        onRemove={handleRemoveClick}
      />

      <div className={`col-items ${colKey}-items ${tasks.length === 0 ? "none" : ""}`}>
        {renderedTasks}
        {tasks.length === 0 && <div className="task-placeholder active"></div>}
      </div>

      {onAddTask && (
        <div className="add-task" onClick={handleAddTaskClick}>
          <CiCirclePlus size={30} className="board-icon" />
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

export default React.memo(Column);
