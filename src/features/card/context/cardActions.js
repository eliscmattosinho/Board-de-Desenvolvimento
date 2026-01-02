import { ACTIONS } from "./cardReducer";

export function useCardActions(state, dispatch) {
  const addCard = (columnId, { boardId, status }) => {
    const columnCards = state.cards.filter(
      (c) => c.boardId === boardId && c.columnId === columnId
    );

    const nextOrder =
      columnCards.length > 0
        ? Math.max(...columnCards.map((c) => c.order ?? 0)) + 1
        : 0;

    return {
      id: String(state.nextId),
      boardId,
      columnId,
      order: nextOrder,
      title: "",
      description: "",
      status: status || null, // Recebe a semântica da coluna do Board
      isNew: true,
      isTemplateCard: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  };

  const saveNewCard = (card) => {
    dispatch({
      type: ACTIONS.ADD_CARD,
      card: { ...card, isNew: false }
    });
    return card;
  };

  const moveCard = (cardId, { boardId, columnId, order }) => {
    dispatch({
      type: ACTIONS.MOVE_CARD,
      payload: { cardId, boardId, columnId, order }
    });
  };

  const updateCard = (cardId, changes) => {
    dispatch({
      type: ACTIONS.UPDATE_CARD,
      cardId,
      changes: { ...changes, updatedAt: Date.now() }
    });
  };

  const deleteCard = (cardId) => {
    dispatch({ type: ACTIONS.DELETE_CARD, cardId });
  };

  const clearCards = (boardId) => {
    dispatch({ type: ACTIONS.CLEAR_CARDS, boardId });
  };

  return {
    addCard,
    saveNewCard,
    moveCard,
    updateCard,
    deleteCard,
    clearCards
  };
}