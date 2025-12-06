import { ACTIONS } from "./boardReducer";

export function useBoardActions(state, dispatch) {
  const setActiveView = (viewId) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, viewId });
  };

  const createBoard = (title) => {
    const id = title.toLowerCase().replace(/\s+/g, "-");
    if (state.boards.find(b => b.id === id)) return;

    const newBoard = { id, title };
    dispatch({ type: ACTIONS.CREATE_BOARD, board: newBoard });
    return newBoard;
  };

  return { setActiveView, createBoard };
}
