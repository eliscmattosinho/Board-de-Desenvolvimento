import { useState, useCallback } from "react";
import { useColumnStyle } from "./useColumnStyle";

export function useDnDLogic({ id, onDrop, onAddTask, onEdit, onRemove }) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);

  const handleDropTask = useCallback((e, targetTaskId = null, position = null) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDragPosition(null);
    onDrop?.(e, id, targetTaskId, position);
  }, [id, onDrop]);

  const handleDragOverTask = useCallback((e, taskId) => {
    e.preventDefault();
    const { top, height } = e.currentTarget.getBoundingClientRect();
    setDragOverIndex(taskId);
    setDragPosition(e.clientY - top < height / 2 ? "above" : "below");
  }, []);

  const handleDragLeaveTask = useCallback(() => {
    setDragOverIndex(null);
    setDragPosition(null);
  }, []);

  const handleAddTaskClick = useCallback(() => onAddTask?.(id), [id, onAddTask]);
  const handleEditClick = useCallback((e) => { e.stopPropagation(); onEdit?.(); }, [onEdit]);
  const handleRemoveClick = useCallback((e) => { e.stopPropagation(); onRemove?.(); }, [onRemove]);

  return {
    dragOverIndex,
    dragPosition,
    handleDropTask,
    handleDragOverTask,
    handleDragLeaveTask,
    handleAddTaskClick,
    handleEditClick,
    handleRemoveClick,
  };
}

export default function useColumn(props) {
  const colStyle = useColumnStyle(props);
  const dndLogic = useDnDLogic(props);

  return { colStyle, ...dndLogic };
}
