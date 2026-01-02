import { saveBoards } from "@board/services/boardPersistence";

export const ACTIONS = {
  INIT_GROUP_BOARDS: "INIT_GROUP_BOARDS",
  CREATE_BOARD: "CREATE_BOARD",
  UPDATE_BOARD: "UPDATE_BOARD",
  DELETE_BOARD: "DELETE_BOARD",
  SET_ACTIVE_BOARD: "SET_ACTIVE_BOARD"
};

export function boardReducer(state, action) {
  let updatedBoards;

  switch (action.type) {
    case ACTIONS.INIT_GROUP_BOARDS: {
      const updatedBoards = action.boards || [];
      // Se não houver activeBoard no estado atual, pega o do payload ou o primeiro disponível
      const activeBoard = state.activeBoard || action.activeBoard || (updatedBoards[0]?.id ?? null);
      
      saveBoards(updatedBoards);
      return { ...state, boards: updatedBoards, activeBoard };
    }

    case ACTIONS.CREATE_BOARD: {
      updatedBoards = [...state.boards, action.board];
      
      saveBoards(updatedBoards);
      return {
        ...state,
        boards: updatedBoards,
        activeBoard: action.board.id
      };
    }

    case ACTIONS.UPDATE_BOARD: {
      updatedBoards = state.boards.map(b =>
        b.id === action.id ? { ...b, ...action.updates } : b
      );

      saveBoards(updatedBoards);
      return { ...state, boards: updatedBoards };
    }

    case ACTIONS.DELETE_BOARD: {
      updatedBoards = state.boards.filter(b => b.id !== action.id);

      let newActive = state.activeBoard;
      if (state.activeBoard === action.id) {
        newActive = updatedBoards.length > 0 ? updatedBoards[0].id : null;
      }

      saveBoards(updatedBoards);
      return { ...state, boards: updatedBoards, activeBoard: newActive };
    }

    case ACTIONS.SET_ACTIVE_BOARD:
      return { ...state, activeBoard: action.boardId };

    default:
      return state;
  }
}