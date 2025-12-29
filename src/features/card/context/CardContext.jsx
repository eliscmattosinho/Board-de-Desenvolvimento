import React, { createContext, useContext, useReducer, useEffect } from "react";

import { loadCardsFromStorage } from "@/features/card/services/cardPersistence";
import { initializeCards } from "@/features/card/services/initializeCardTemplates";
import { cardReducer, ACTIONS } from "./cardReducer";
import { useCardActions } from "./cardActions";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";

const CardContext = createContext(null);

export const CardProvider = ({ children, boardId = "kanban" }) => {
  if (!boardId) {
    throw new Error("CardProvider requires boardId");
  }

  /**
   * Define escopo de persistência
   * Boards sincronizados compartilham groupId
   */
  const groupId = syncedBoardsMap[boardId] ?? null;
  const loadOpts = groupId ? { groupId } : { boardId };

  /**
   * Estado inicial vindo do storage
   */
  const saved = loadCardsFromStorage(loadOpts) || [];

  const initialNextId =
    saved.length > 0 ? Math.max(...saved.map((t) => Number(t.id))) + 1 : 1;

  const [state, dispatch] = useReducer(cardReducer, {
    cards: saved,
    nextId: initialNextId,
  });

  /**
   * Inicialização de templates
   * Executa apenas uma vez por boardId
   */
  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const initialized = await initializeCards();
      if (!mounted) return;

      /**
       * Sempre prioriza o que já está persistido.
       * Templates só entram se storage estiver vazio.
       */
      const persisted = loadCardsFromStorage(loadOpts) || [];

      const source =
        persisted.length > 0
          ? persisted
          : initialized.map((t, i) => ({
              ...t,
              id: String(t.id ?? i + 1),
              order: t.order ?? i,
            }));

      const maxId = source.reduce((max, t) => Math.max(max, Number(t.id)), 0);

      dispatch({
        type: ACTIONS.SET_MIRROR_CARDS,
        cards: source,
        nextId: maxId + 1,
      });
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [boardId, groupId]);

  /**
   * Actions desacopladas da lógica estrutural
   */
  const actions = useCardActions(state, dispatch);

  return (
    <CardContext.Provider
      value={{
        cards: state.cards,
        ...actions,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

/**
 * Hook público
 */
export const useCardsContext = () => {
  const ctx = useContext(CardContext);
  if (!ctx) {
    throw new Error("useCardsContext must be used within CardProvider");
  }
  return ctx;
};
