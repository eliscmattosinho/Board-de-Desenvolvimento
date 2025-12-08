import { ACTIONS } from "./boardReducer";

// colocar em tils geral
function normalizeId(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function useBoardActions(state, dispatch) {
  const validateTitle = (title) => {
    if (!title || !title.trim()) return "Título não pode ser vazio.";
    if (title.length < 3) return "Título deve ter ao menos 3 caracteres.";
    return null;
  };

  const createBoard = (title) => {
    const error = validateTitle(title);
    if (error) return { error };

    const id = normalizeId(title);
    if (state.boards.some((b) => b.id === id))
      return { error: "Já existe um board com esse nome." };

    const newBoard = { id, title, groupId: null };
    dispatch({ type: ACTIONS.CREATE_BOARD, board: newBoard });

    return { board: newBoard };
  };

  const updateBoard = (id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_BOARD, id, updates });
  };

  const deleteBoard = (id, syncCallback) => {
    dispatch({ type: ACTIONS.DELETE_BOARD, id });

    // sincroniza colunas/tasks externas
    if (syncCallback) syncCallback(id);
  };

  const setactiveBoard = (viewId) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_BOARD, viewId });
  };

  return {
    validateTitle,
    createBoard,
    updateBoard,
    deleteBoard,
    setactiveBoard
  };
}
