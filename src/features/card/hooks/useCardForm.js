import { useState, useEffect, useRef } from "react";

export default function useCardForm(card, columns) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(null);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!card || initializedRef.current) return;

    setTitle(card.title || "");
    setDescription(card.description || "");
    setColumnId(card.columnId ?? columns?.[0]?.id ?? null);

    initializedRef.current = true;
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
