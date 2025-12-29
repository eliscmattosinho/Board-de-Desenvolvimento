export function getActiveBoardTitle(boards, activeBoard) {
    const board = boards.find((b) => b.id === activeBoard);
    return board?.title || activeBoard;
}

export function groupCardsByColumn({
    columns,
    cards,
    activeBoard,
}) {
    return columns.reduce((acc, col) => {
        acc[col.id] = cards.filter((t) => {
            if (t.boardId === activeBoard) {
                return t.columnId === col.id;
            }
            return t.mirrorColId === col.id;
        });
        return acc;
    }, {});
}
