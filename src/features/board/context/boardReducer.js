import { saveBoards } from "@board/services/boardPersistence";

export const ACTIONS = {
  SET_BOARDS: "SET_BOARDS",
  CREATE_BOARD: "CREATE_BOARD",
  SET_ACTIVE_VIEW: "SET_ACTIVE_VIEW",
};

export function boardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_BOARDS:
      return { ...state, boards: action.boards, activeView: action.activeView };

    case ACTIONS.CREATE_BOARD: {
      const newBoard = action.board;
      const updatedBoards = [...state.boards, newBoard];
      saveBoards(updatedBoards);
      return { ...state, boards: updatedBoards, activeView: newBoard.id };
    }

    case ACTIONS.SET_ACTIVE_VIEW:
      return { ...state, activeView: action.viewId };

    default:
      return state;
  }
}
