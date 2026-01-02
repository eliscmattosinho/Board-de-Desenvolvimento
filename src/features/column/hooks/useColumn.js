import { useCallback } from "react";
import { useColumnStyle } from "./useColumnStyle";

export default function useColumn({
  id,
  onAddCard,
  onEdit,
  onRemove,
  style,
  color,
  applyTo,
  isTemplate,
}) {
  const colStyle = useColumnStyle({
    style,
    color,
    applyTo,
    isTemplate,
  });

  const handleAddCardClick = useCallback(
    () => onAddCard?.(id),
    [id, onAddCard]
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
    handleAddCardClick,
    handleEditClick,
    handleRemoveClick,
  };
}
