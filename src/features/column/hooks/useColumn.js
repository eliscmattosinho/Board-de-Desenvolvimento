import { useState, useCallback } from "react";
import { useColumnStyle } from "./useColumnStyle";

export default function useColumn({ id, onAddTask, onEdit, onRemove, style, color, applyTo, }) {
  const colStyle = useColumnStyle({ id, style, color, applyTo });

  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);

  const setDragOver = useCallback((taskId, position) => {
    setDragOverIndex(taskId);
    setDragPosition(position);
  }, []);

  const clearDragOver = useCallback(() => {
    setDragOverIndex(null);
    setDragPosition(null);
  }, []);

  const handleAddTaskClick = useCallback(
    () => onAddTask?.(id),
    [id, onAddTask]
  );

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

  return {
    colStyle,
    dragOverIndex,
    dragPosition,
    setDragOver,
    clearDragOver,
    handleAddTaskClick,
    handleEditClick,
    handleRemoveClick,
  };
}
