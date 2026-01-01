import { saveBoards, loadBoards } from "@board/services/boardPersistence";

export const ACTIONS = {
  INIT_GROUP_BOARDS: "INIT_GROUP_BOARDS",
  CREATE_BOARD: "CREATE_BOARD",
  UPDATE_BOARD: "UPDATE_BOARD",
  DELETE_BOARD: "DELETE_BOARD",
  SET_ACTIVE_BOARD: "SET_ACTIVE_BOARD"
};

export function boardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT_GROUP_BOARDS: {
      const boards = action.boards;
      const activeBoard = action.activeBoard || (boards[0] ? boards[0].id : null);
      const groupKey = action.groupId || "shared";

      saveBoards(groupKey, boards);

      return { ...state, boards, activeBoard };
    }

    case ACTIONS.CREATE_BOARD: {
      const newBoard = action.board;
      const updatedBoards = [...state.boards, newBoard];

      const key = newBoard.groupId
        ? `group_${newBoard.groupId}`
        : `board_${newBoard.id}`;

      const existing = loadBoards(newBoard.groupId) || [];
      saveBoards(key, [...existing, newBoard]);

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

      const target = updatedBoards.find(b => b.id === action.id);
      const key = target.groupId
        ? `group_${target.groupId}`
        : `board_${target.id}`;

      saveBoards(key, updatedBoards);

      return { ...state, boards: updatedBoards };
    }

    case ACTIONS.DELETE_BOARD: {
      const updatedBoards = state.boards.filter(b => b.id !== action.id);

      let newActive = state.activeBoard;
      if (state.activeBoard === action.id) {
        newActive = updatedBoards.length > 0 ? updatedBoards[0].id : null;
      }

      const key =
        updatedBoards.length > 0
          ? (updatedBoards[0].groupId
              ? `group_${updatedBoards[0].groupId}`
              : updatedBoards[0].id)
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
