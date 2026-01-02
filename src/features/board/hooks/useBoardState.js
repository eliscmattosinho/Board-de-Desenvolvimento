import { useEffect, useReducer } from "react";
import { boardReducer, ACTIONS } from "../context/boardReducer";
import { loadBoards } from "@board/services/boardPersistence";
import { boardTemplates } from "@board/domain/boardTemplates";

function getTemplateBoardsByGroup(groupId) {
  return Object.entries(boardTemplates)
    .filter(([_, config]) => config.groupId === groupId)
    .map(([id, config]) => ({
      id,
      title: config.title ?? id,
      groupId
    }));
}

export function useBoardState({ initialGroup = "shared" } = {}) {
  const [state, dispatch] = useReducer(boardReducer, {
    boards: [],
    activeBoard: ""
  });

  useEffect(() => {
    // Carrega com fallback garantido para Array
    const storedBoards = loadBoards() || [];
    const templates = getTemplateBoardsByGroup(initialGroup);

    const boardMap = new Map();

    // Inserir templates primeiro
    templates.forEach(b => boardMap.set(b.id, b));

    // Inserir salvos apenas se for um array válido
    if (Array.isArray(storedBoards)) {
      storedBoards.forEach(b => {
        if (b && b.id && !boardMap.has(b.id)) {
          boardMap.set(b.id, b);
        }
      });
    }

    const finalBoards = Array.from(boardMap.values());

    dispatch({
      type: ACTIONS.INIT_GROUP_BOARDS,
      boards: finalBoards,
      activeBoard: state.activeBoard || finalBoards[0]?.id || ""
    });
  }, [initialGroup]);

  return {
    state,
    dispatch,
    boards: state.boards,
    activeBoard: state.activeBoard
  };
}