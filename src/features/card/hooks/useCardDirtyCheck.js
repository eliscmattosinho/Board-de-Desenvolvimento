export function useCardDirtyCheck({
    card,
    title,
    description,
    columnId,
    editMode,
    columns,
}) {
    // Se não está editando ou não há card, não há "sujeira"
    if (!editMode || !card) return false;

    const originalColumnId = card.columnId ?? columns?.[0]?.id ?? null;

    const hasTitleChanged = title.trim() !== (card.title || "").trim();
    const hasDescriptionChanged =
        description.trim() !== (card.description || "").trim();
    const hasColumnChanged = columnId !== originalColumnId;

    return hasTitleChanged || hasDescriptionChanged || hasColumnChanged;
}
