export function getActiveBoardTitle(boards, activeBoard) {
    const board = boards.find((b) => b.id === activeBoard);
    return board?.title || activeBoard;
}
