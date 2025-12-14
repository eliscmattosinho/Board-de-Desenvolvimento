import { useEffect, useReducer } from "react";
import { boardReducer, ACTIONS } from "../context/boardReducer";
import { loadBoards } from "@board/services/boardPersistence";
import { boardTemplate } from "@board/components/templates/boardTemplates";

/**
 * Estado inicial do hook
 */
function buildInitialGroupBoards(groupId) {
    const templateBoards = Object.entries(boardTemplate)
        .filter(([id, config]) => config.groupId === groupId)
        .map(([id, config]) => ({
            id,
            title: config.title ?? id,
            groupId
        }));

    return templateBoards;
}

/**
 * Hook principal de estado de boards
 * Responsável por:
 *  - carregar boards do storage
 *  - ou criar boards padrão do template
 *  - inicializar activeBoard
 */
export function useBoardState({ initialGroup }) {
    const [state, dispatch] = useReducer(boardReducer, {
        boards: [],
        activeBoard: ""
    });

    // inicialização do grupo
    useEffect(() => {
        const stored = loadBoards(initialGroup);

        if (stored && stored.length > 0) {
            dispatch({
                type: ACTIONS.SET_MIRROR_BOARDS,
                boards: stored,
                activeBoard: stored[0].id,
                groupId: initialGroup
            });
            return;
        }

        // fallback: cria boards padrão do template
        const defaults = buildInitialGroupBoards(initialGroup);

        dispatch({
            type: ACTIONS.SET_MIRROR_BOARDS,
            boards: defaults,
            activeBoard: defaults[0]?.id ?? "",
            groupId: initialGroup
        });
    }, [initialGroup]);

    return {
        state,
        dispatch,
        boards: state.boards,
        activeBoard: state.activeBoard
    };
}
