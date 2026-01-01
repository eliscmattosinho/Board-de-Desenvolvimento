import { saveCards } from "@/features/card/services/cardPersistence";

export const ACTIONS = {
  SET_CARDS: "SET_CARDS",
  ADD_CARD: "ADD_CARD",
  MOVE_CARD: "MOVE_CARD",
  UPDATE_CARD: "UPDATE_CARD",
  DELETE_CARD: "DELETE_CARD",
  CLEAR_CARDS: "CLEAR_CARDS"
};

export function cardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CARDS:
      saveCards(action.cards, { groupId: "root" });
      return { ...state, cards: action.cards, nextId: action.nextId };

    case ACTIONS.ADD_CARD: {
      const updated = [...state.cards, action.card];
      saveCards(updated, { groupId: "root" });
      return { cards: updated, nextId: state.nextId + 1 };
    }

    case ACTIONS.MOVE_CARD: {
  const { cardId, columnId, order, boardId } = action.payload;

  const updated = state.cards.map(c =>
    String(c.id) === String(cardId)
      ? { ...c, boardId, columnId, order, updatedAt: Date.now() }
      : c
  );

  // normalize order only for the column
  const scoped = updated
    .filter(c => c.boardId === boardId && c.columnId === columnId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const normalized = updated.map(c => {
    const idx = scoped.findIndex(s => s.id === c.id);
    return idx === -1 ? c : { ...c, order: idx };
  });

  saveCards(normalized, { groupId: "root" });
  return { ...state, cards: normalized };
}

    case ACTIONS.UPDATE_CARD: {
      const updated = state.cards.map((c) =>
        String(c.id) === String(action.cardId)
          ? { ...c, ...action.changes }
          : c
      );
      saveCards(updated, { groupId: "root" });
      return { ...state, cards: updated };
    }

    case ACTIONS.DELETE_CARD: {
      const updated = state.cards.filter(
        (c) => String(c.id) !== String(action.cardId)
      );
      saveCards(updated, { groupId: "root" });
      return { ...state, cards: updated };
    }

    case ACTIONS.CLEAR_CARDS: {
      const filtered = state.cards.filter(
        (c) => c.boardId !== action.boardId
      );
      saveCards(filtered, { groupId: "root" });
      return { ...state, cards: filtered };
    }

    default:
      return state;
  }
}
