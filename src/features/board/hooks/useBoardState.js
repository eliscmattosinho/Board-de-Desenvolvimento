import { useEffect, useReducer } from "react";
import { boardReducer, ACTIONS } from "../context/boardReducer";
import { loadBoards } from "@board/services/boardPersistence";
import { boardTemplate } from "@board/domain/boardTemplates";

function buildInitialGroupBoards(groupId) {
  return Object.entries(boardTemplate)
    .filter(([_, config]) => config.groupId === groupId)
    .map(([id, config]) => ({
      id,
      title: config.title ?? id,
      groupId
    }));
}

export function useBoardState({ initialGroup } = {}) {
  const [state, dispatch] = useReducer(boardReducer, {
    boards: [],
    activeBoard: ""
  });

  const group = initialGroup ?? "shared";

  useEffect(() => {
    const storedBoards = loadBoards(group) || [];

    if (storedBoards.length > 0) {
      dispatch({
        type: ACTIONS.INIT_GROUP_BOARDS,
        boards: storedBoards,
        activeBoard: storedBoards[0].id,
        groupId: group
      });
      return;
    }

    const templateBoards = buildInitialGroupBoards(group);

    dispatch({
      type: ACTIONS.INIT_GROUP_BOARDS,
      boards: templateBoards,
      activeBoard: templateBoards[0]?.id ?? "",
      groupId: group
    });
  }, [group]);

  return {
    state,
    dispatch,
    boards: state.boards,
    activeBoard: state.activeBoard
  };
}
