import { saveCards } from "@card/services/cardPersistence";

export const ACTIONS = {
  SET_CARDS: "SET_CARDS",
  ADD_CARD: "ADD_CARD",
  MOVE_CARD: "MOVE_CARD",
  UPDATE_CARD: "UPDATE_CARD",
  DELETE_CARD: "DELETE_CARD",
  CLEAR_CARDS: "CLEAR_CARDS"
};

export function cardReducer(state, action) {
  let updatedCards;

  switch (action.type) {
    case ACTIONS.SET_CARDS:
      saveCards(action.cards);
      return { ...state, cards: action.cards, nextId: action.nextId };

    case ACTIONS.ADD_CARD:
      updatedCards = [...state.cards, action.card];
      saveCards(updatedCards);
      return { cards: updatedCards, nextId: state.nextId + 1 };

    case ACTIONS.MOVE_CARD: {
      const { cardId, columnId, order, boardId, status } = action.payload;

      // Atualiza o card alvo
      const updated = state.cards.map(c => {
        if (String(c.id) !== String(cardId)) return c;

        return {
          ...c,
          // boardId original se for um espelhamento, 
          // ou atualiza se for um movimento dentro do próprio board
          boardId: c.boardId === boardId ? c.boardId : boardId,
          columnId,
          order,
          status: status || c.status, // O status é a chave para o espelhamento funcionar
          updatedAt: Date.now()
        };
      });

      // Normaliza a ordem apenas para os cards que competem na mesma coluna visual
      const scoped = updated
        .filter(c => c.columnId === columnId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const normalized = updated.map(c => {
        if (c.columnId !== columnId) return c;
        const idx = scoped.findIndex(s => s.id === c.id);
        return { ...c, order: idx };
      });

      saveCards(normalized);
      return { ...state, cards: normalized };
    }

    case ACTIONS.UPDATE_CARD:
      updatedCards = state.cards.map((c) =>
        String(c.id) === String(action.cardId)
          ? { ...c, ...action.changes }
          : c
      );
      saveCards(updatedCards);
      return { ...state, cards: updatedCards };

    case ACTIONS.DELETE_CARD:
      updatedCards = state.cards.filter(
        (c) => String(c.id) !== String(action.cardId)
      );
      saveCards(updatedCards);
      return { ...state, cards: updatedCards };

    case ACTIONS.CLEAR_CARDS:
      updatedCards = state.cards.filter(
        (c) => c.boardId !== action.boardId
      );
      saveCards(updatedCards);
      return { ...state, cards: updatedCards };

    default:
      return state;
  }
}