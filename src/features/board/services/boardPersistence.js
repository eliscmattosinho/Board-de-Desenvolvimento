export function saveBoards(boards) {
  sessionStorage.setItem("boards", JSON.stringify(boards));
}

export function loadBoardsFromStorage() {
  const saved = sessionStorage.getItem("boards");
  return saved ? JSON.parse(saved) : null;
}
