import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import ColumnHeader from "./ColumnHeader";
import ColumnTasks from "./ColumnTasks";
import useColumn from "@column/hooks/useColumn";
import { useCardDrag } from "@board/context/CardDragContext";

import "./Column.css";

function Column({
  id,
  title,
  className,
  style,
  color,
  applyTo,
  tasks,
  onTaskClick,
  onAddTask,
  onEdit,
  onRemove,
}) {
  const { setDropTarget, isDraggingCard } = useCardDrag();

  const {
    colStyle,
    dragOverIndex,
    dragPosition,
    setDragOver,
    clearDragOver,
    handleAddTaskClick,
    handleEditClick,
    handleRemoveClick,
  } = useColumn({
    id,
    onAddTask,
    onEdit,
    onRemove,
    style,
    color: color || style?.bg || "#EFEFEF",
    applyTo,
  });

  return (
    <div
      className={`board-col ${className ?? ""}`}
      id={id}
      style={{
        "--col-bg": colStyle.bg,
        "--col-border": colStyle.border,
        "--col-font": colStyle.color,
      }}
      onPointerEnter={() => {
        if (!isDraggingCard()) return;

        setDropTarget({
          columnId: id,
          position: "top",
        });
      }}
      onPointerLeave={() => {
        clearDragOver();
      }}
    >
      <ColumnHeader
        title={title}
        tasksLength={tasks.length}
        onEdit={handleEditClick}
        onRemove={handleRemoveClick}
      />

      <div className="col-items">
        <ColumnTasks
          tasks={tasks}
          dragOverIndex={dragOverIndex}
          dragPosition={dragPosition}
          onTaskClick={onTaskClick}
          onHoverTask={(taskId, position) => {
            if (!isDraggingCard()) return;

            setDragOver(taskId, position);
            setDropTarget({
              columnId: id,
              targetTaskId: taskId,
              position,
            });
          }}
          onLeaveTask={clearDragOver}
        />

        {tasks.length === 0 && isDraggingCard() && (
          <div className="task-placeholder active" />
        )}
      </div>

      {onAddTask && (
        <button className="add-task" onClick={handleAddTaskClick}>
          <CiCirclePlus size={30} />
        </button>
      )}
    </div>
  );
}

export default React.memo(Column);
