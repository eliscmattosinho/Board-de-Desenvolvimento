export function getActiveBoardTitle(boards, activeView) {
    const board = boards.find((b) => b.id === activeView);
    return board?.title || activeView;
}
