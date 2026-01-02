import { useState, useEffect } from "react";

export default function useCardForm(card, columns) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(null);

  useEffect(() => {
    if (!card) return;

    setTitle(card.title || "");
    setDescription(card.description || "");
    setColumnId(card.columnId ?? columns?.[0]?.id ?? null);

    // O formulário reseta sempre que o card.id mudar
  }, [card?.id, columns]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    columnId,
    setColumnId,
  };
}
