export function getActiveBoardTitle(boards, activeBoard) {
    const board = boards.find((b) => b.id === activeBoard);
    return board?.title || activeBoard;
}

export function groupTasksByColumn({
    columns,
    tasks,
    activeBoard,
}) {
    return columns.reduce((acc, col) => {
        acc[col.id] = tasks.filter((t) => {
            if (t.boardId === activeBoard) {
                return t.columnId === col.id;
            }
            return t.mirrorColId === col.id;
        });
        return acc;
    }, {});
}
