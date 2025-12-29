export function useCardDirtyCheck({
    card,
    title,
    description,
    columnId,
    editMode,
    columns,
}) {
    if (!editMode || !card) return false;

    const originalColumnId = card.columnId ?? columns?.[0]?.id ?? null;

    return (
        title.trim() !== (card.title || "").trim() ||
        description.trim() !== (card.description || "").trim() ||
        columnId !== originalColumnId
    );
}
