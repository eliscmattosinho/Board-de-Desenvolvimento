import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { loadCardFromStorage } from "@card/services/cardPersistence";
import { loadAndInitializeCards } from "@card/services/cardTemplates";
import { cardReducer, ACTIONS } from "./cardReducer";
import { useCardActions } from "./cardActions";
import { resolveInitialCardLocation } from "@board/domain/cardBoardResolver";

const CardContext = createContext(null);

export const CardProvider = ({ children }) => {
  // Memoizamos o carregamento inicial para evitar loops
  const saved = useMemo(() => loadCardFromStorage(), []);

  const [state, dispatch] = useReducer(cardReducer, {
    cards: saved,
    nextId: saved.length > 0 ? Math.max(...saved.map(c => Number(c.id))) + 1 : 1
  });

  useEffect(() => {
    // Só busca templates se o storage estiver vazio
    if (state.cards.length === 0 && saved.length === 0) {
      (async () => {
        try {
          const rawTemplates = await loadAndInitializeCards();

          // Aplica a localização inicial (Board + Column) antes de salvar no estado
          const localizedCards = rawTemplates.map(card => {
            const location = resolveInitialCardLocation(card);
            return {
              ...card,
              boardId: location.boardId,
              columnId: location.columnId
            };
          });

          dispatch({
            type: ACTIONS.SET_CARDS,
            cards: localizedCards,
            nextId: localizedCards.length + 1
          });
        } catch (error) {
          console.error("Erro na inicialização do CardProvider:", error);
        }
      })();
    }
  }, []);

  const actions = useCardActions(state, dispatch);

  const contextValue = useMemo(() => ({
    cards: state.cards,
    ...actions
  }), [state.cards, actions]);

  return (
    <CardContext.Provider value={contextValue}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardsContext = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCardsContext must be used within CardProvider");
  return ctx;
};