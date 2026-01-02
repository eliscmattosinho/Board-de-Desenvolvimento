import { ACTIONS } from "./boardReducer";
import { normalizeText } from "@/utils/normalizeUtils";

function normalizeId(value) {
  return normalizeText(value)
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

    if (state.boards.some((b) => b.id === id)) {
      return { error: "Já existe um board com esse nome." };
    }

    const newBoard = { id, title, groupId: null };
    dispatch({ type: ACTIONS.CREATE_BOARD, board: newBoard });

    return { board: newBoard };
  };

  const updateBoard = (id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_BOARD, id, updates });
  };

  const deleteBoard = (id, syncCallback) => {
    dispatch({ type: ACTIONS.DELETE_BOARD, id });
    if (syncCallback) syncCallback(id);
  };

  const setActiveBoard = (boardId) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_BOARD, boardId });
  };

  return {
    validateTitle,
    createBoard,
    updateBoard,
    deleteBoard,
    setActiveBoard,
  };
}
