import React, { createContext, useContext, useReducer, useEffect } from "react";
import { loadCardFromStorage } from "@/features/card/services/cardPersistence";
import loadCards from "@/features/card/services/cardTemplates";
import { cardReducer, ACTIONS } from "./cardReducer";
import { useCardActions } from "./cardActions";

const CardContext = createContext(null);

export const CardProvider = ({ children }) => {
  const saved = loadCardFromStorage({ groupId: "root" });

  const initialNextId =
    saved.length > 0
      ? Math.max(...saved.map((c) => Number(c.id))) + 1
      : 1;

  const [state, dispatch] = useReducer(cardReducer, {
    cards: saved,
    nextId: initialNextId
  });

  useEffect(() => {
    if (saved.length === 0) {
      (async () => {
        const templates = await loadCards();
        dispatch({
          type: ACTIONS.SET_CARDS,
          cards: templates,
          nextId: templates.length + 1
        });
      })();
    }
  }, []);

  const actions = useCardActions(state, dispatch);

  return (
    <CardContext.Provider value={{ cards: state.cards, ...actions }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardsContext = () => {
  const ctx = useContext(CardContext);
  if (!ctx) {
    throw new Error("useCardsContext must be used within CardProvider");
  }
  return ctx;
};
