import { useCallback } from "react";
import { useColumnStyle } from "./useColumnStyle";

export default function useColumn({
  id,
  index,
  columnData,
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
      e?.stopPropagation();
      onEdit?.(index, columnData);
    },
    [index, columnData, onEdit]
  );

  const handleRemoveClick = useCallback(
    (e) => {
      e?.stopPropagation();
      onRemove?.(columnData);
    },
    [columnData, onRemove]
  );

  return {
    colStyle,
    handleAddCardClick,
    handleEditClick,
    handleRemoveClick,
  };
}
