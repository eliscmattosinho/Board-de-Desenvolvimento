import { useState, useEffect } from "react";

export default function useCardForm(card, columns) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (!card) return;

    const defaultCol = card.columnId ?? columns?.[0]?.id ?? null;
    const initTitle = card.title || "";
    const initDesc = card.description || "";

    setTitle(initTitle);
    setDescription(initDesc);
    setColumnId(defaultCol);

    // Define o baseline exato da inicialização
    setInitialValues({
      title: initTitle,
      description: initDesc,
      columnId: defaultCol,
    });

    setIsInitialized(true);
  }, [card?.id, columns]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    columnId,
    setColumnId,
    isInitialized,
    initialValues,
  };
}
