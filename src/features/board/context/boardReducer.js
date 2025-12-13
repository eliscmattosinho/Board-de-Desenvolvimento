import { saveBoards } from "@board/services/boardPersistence";

export const ACTIONS = {
  SET_MIRROR_BOARDS: "SET_MIRROR_BOARDS",
  CREATE_BOARD: "CREATE_BOARD",
  UPDATE_BOARD: "UPDATE_BOARD",
  DELETE_BOARD: "DELETE_BOARD",
  SET_ACTIVE_BOARD: "SET_ACTIVE_BOARD"
};

export function boardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_MIRROR_BOARDS: {
      const boards = action.boards;
      const activeBoard = action.activeBoard || (boards[0] ? boards[0].id : null);

      // Persistência inicial: apenas boards espelhados do grupo
      const groupKey = action.groupId || "shared";
      saveBoards(groupKey, boards);

      return { ...state, boards, activeBoard };
    }

    case ACTIONS.CREATE_BOARD: {
      const newBoard = action.board;
      const updatedBoards = [...state.boards, newBoard];

      // boards independentes => salvam sob sua própria key
      const key = newBoard.groupId || newBoard.id;
      saveBoards(key, updatedBoards);

      return {
        ...state,
        boards: updatedBoards,
        activeBoard: newBoard.id
      };
    }

    case ACTIONS.UPDATE_BOARD: {
      const updatedBoards = state.boards.map(b =>
        b.id === action.id ? { ...b, ...action.updates } : b
      );

      // identifica corretamente a key para persistência
      const target = updatedBoards.find(b => b.id === action.id);
      const key = target.groupId || target.id;

      saveBoards(key, updatedBoards);

      return { ...state, boards: updatedBoards };
    }

    case ACTIONS.DELETE_BOARD: {
      const updatedBoards = state.boards.filter(b => b.id !== action.id);

      // recalcula activeBoard
      let newActive = state.activeBoard;
      if (state.activeBoard === action.id) {
        newActive = updatedBoards.length > 0 ? updatedBoards[0].id : null;
      }

      // persistência usando a chave correta
      const key =
        updatedBoards.length > 0
          ? (updatedBoards[0].groupId || updatedBoards[0].id)
          : action.id;

      saveBoards(key, updatedBoards);

      return { ...state, boards: updatedBoards, activeBoard: newActive };
    }

    case ACTIONS.SET_ACTIVE_BOARD:
      return { ...state, activeBoard: action.boardId };

    default:
      return state;
  }
}
