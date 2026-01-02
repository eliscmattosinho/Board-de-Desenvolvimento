import { ACTIONS } from "./boardReducer";
import { normalizeText } from "@/utils/normalizeUtils";
import { useCardsContext } from "@card/context/CardContext";
import { useColumnsContext } from "@column/context/ColumnContext";

function normalizeId(value) {
  return normalizeText(value)
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function useBoardActions(state, dispatch) {
  const { clearCards } = useCardsContext();
  const { columns: allColumns, removeColumn } = useColumnsContext();

  const validateTitle = (title) => {
    if (!title || !title.trim()) return "Título não pode ser vazio.";
    if (title.length < 3) return "Título deve ter ao menos 3 caracteres.";
    return null;
  };

  const getBoardsToClear = (activeBoardId) => {
    const boards = state.boards || [];
    const board = boards.find((b) => b.id === activeBoardId);
    if (!board) return [];
    if (board.groupId) {
      return boards.filter((b) => b.groupId === board.groupId).map((b) => b.id);
    }
    return [activeBoardId];
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

  const deleteBoard = (id) => {
    dispatch({ type: ACTIONS.DELETE_BOARD, id });

    clearCards(id);

    const boardColumns = allColumns[id] || [];
    boardColumns.forEach((col) => removeColumn(id, col.id));
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
    getBoardsToClear,
  };
}
