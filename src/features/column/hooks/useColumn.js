import { useState, useCallback, useMemo } from "react";

/**
 * Hook privado: lógica de estilo
 */
function useStyleLogic({ style, styleVars, color, applyTo }) {
  const isColorDark = useCallback((hex) => {
    if (!hex) return false;
    let r, g, b;
    if (hex.startsWith("#")) {
      const c = hex.slice(1);
      r = parseInt(c.substr(0, 2), 16);
      g = parseInt(c.substr(2, 2), 16);
      b = parseInt(c.substr(4, 2), 16);
    } else if (hex.startsWith("rgb")) {
      const match = hex.match(/\d+/g);
      if (!match) return false;
      [r, g, b] = match.map(Number);
    }
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance < 0.5;
  }, []);

  return useMemo(() => {
    const defaultStyle = style || styleVars || {
      bg: "transparent",
      border: "transparent",
      color: "#212121",
    };

    const bg = applyTo === "fundo" ? color || defaultStyle.bg : defaultStyle.bg;
    const border = applyTo === "borda" ? color || defaultStyle.border : defaultStyle.border;
    const font = applyTo === "fundo"
      ? isColorDark(color) ? "#EFEFEF" : "#212121"
      : color || defaultStyle.color;

    return { bg, border, color: font };
  }, [style, styleVars, color, applyTo, isColorDark]);
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
