import React from "react";

import { CiCirclePlus } from "react-icons/ci";

import ColumnHeader from "./ColumnHeader";
import ColumnTasks from "./ColumnTasks";
import useColumn from "../hooks/useColumn";

import "./Column.css";

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
  style,
  styleVars,
}) {
  const colKey = className?.split(" ").pop() || "default";

  const {
    colStyle,
    dragOverIndex,
    dragPosition,
    handleDropTask,
    handleDragOverTask,
    handleDragLeaveTask,
    handleAddTaskClick,
    handleEditClick,
    handleRemoveClick,
  } = useColumn({ id, onDrop, onAddTask, onEdit, onRemove, style, styleVars, color, applyTo });

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
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDropTask(e, null)}
      />

      <div className={`col-items ${colKey}-items ${tasks.length === 0 ? "none" : ""}`}>
        <ColumnTasks
          tasks={tasks}
          dragOverIndex={dragOverIndex}
          dragPosition={dragPosition}
          onTaskClick={onTaskClick}
          onDragStart={onDragStart}
          onDropTask={handleDropTask}
          onDragOverTask={handleDragOverTask}
          onDragLeaveTask={handleDragLeaveTask}
        />
        {tasks.length === 0 && <div className="task-placeholder active"></div>}
      </div>

      {onAddTask && (
        <div className="add-task" onClick={handleAddTaskClick}>
          <CiCirclePlus size={30} className="plus-icon" />
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
