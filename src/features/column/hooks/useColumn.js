import { useState, useCallback, useMemo, useRef } from "react";
import { getContrastColor } from "@column/utils/colorUtils";

/**
 * Hook privado: calcula estilo (fundo, borda e cor do texto) com contraste correto
 */
function useStyleLogic({ style, color, applyTo }) {
  const firstRender = useRef(true);

  return useMemo(() => {
    const targetColor = color || style?.bg || "#EFEFEF";
    let textColor;

    if (firstRender.current) {
      // mantém cor do template na primeira renderização
      textColor = style?.color || "#212121";
      firstRender.current = false;
    } else {
      textColor = getContrastColor(targetColor);
    }

    if (applyTo === "fundo") {
      return {
        bg: targetColor,
        border: "transparent",
        color: textColor,
      };
    }

    if (applyTo === "borda") {
      return {
        bg: "transparent",
        border: targetColor,
        color: textColor,
      };
    }

    return {
      bg: style?.bg || "transparent",
      border: style?.border || "transparent",
      color: textColor,
    };
  }, [style, color, applyTo]);
}

/**
 * Hook privado: lógica de drag & drop
 */
function useDnDLogic({ id, onDrop, onAddTask, onEdit, onRemove }) {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);

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

/**
 * Hook público: combina estilo + drag & drop
 */
export default function useColumn(props) {
  const colStyle = useStyleLogic(props);
  const dndLogic = useDnDLogic(props);

  return {
    colStyle,
    ...dndLogic,
  };
}
