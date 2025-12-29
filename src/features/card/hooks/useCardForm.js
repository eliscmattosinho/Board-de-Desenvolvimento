import { useState, useEffect } from "react";

export default function useCardForm(card, columns) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(null);

  useEffect(() => {
    if (!card) return;

    setTitle(card.title || "");
    setDescription(card.description || "");

    if (card.columnId) {
      setColumnId(card.columnId);
      return;
    }

    if (columns?.length) {
      setColumnId(columns[0].id);
    }
  }, [card, columns]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    columnId,
    setColumnId,
  };
}
