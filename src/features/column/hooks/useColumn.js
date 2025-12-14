import { useState, useCallback } from "react";
import { useColumnStyle } from "./useColumnStyle";

export function useDnDLogic({ id, onDrop, onAddTask, onEdit, onRemove }) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);

  /**
   * Assinatura
   * handleDrop(event, columnId, targetTaskId, position)
   */
  const handleDropTask = useCallback(
    (e, targetTaskId = null, position = null) => {
      e.preventDefault();
      e.stopPropagation();

      setDragOverIndex(null);
      setDragPosition(null);

      if (!id) return;

      onDrop?.(e, id, targetTaskId, position);
    },
    [id, onDrop]
  );

  /**
   * Drag over em uma task (define posição above / below)
   */
  const handleDragOverTask = useCallback((e, taskId) => {
    e.preventDefault();
    e.stopPropagation();

    const { top, height } = e.currentTarget.getBoundingClientRect();
    const isAbove = e.clientY - top < height / 2;

    setDragOverIndex(taskId);
    setDragPosition(isAbove ? "above" : "below");
  }, []);

  /**
   * Saiu do hover de uma task
   */
  const handleDragLeaveTask = useCallback(() => {
    setDragOverIndex(null);
    setDragPosition(null);
  }, []);

  /**
   * Ações auxiliares
   */
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
