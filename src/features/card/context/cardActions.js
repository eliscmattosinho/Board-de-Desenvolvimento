import { ACTIONS } from "./cardReducer";

export function useCardActions(state, dispatch) {
  /**
   * Cria card temporária (UI only)
   * Define order inicial com base na coluna
   */
  const addCard = (columnId = null, { boardId } = {}) => {
    if (!boardId) throw new Error("addCard requires boardId");

    const tempId = String(state.nextId);

    const columnCards = state.cards.filter(
      (t) => t.boardId === boardId && t.columnId === columnId
    );

    const nextOrder =
      columnCards.length > 0
        ? Math.max(...columnCards.map((t) => t.order ?? 0)) + 1
        : 0;

    return {
      id: tempId,
      title: "",
      description: "",
      status: null,
      boardId,
      columnId,
      mirrorColId: null,
      order: nextOrder,
      isNew: true,
      createdAt: new Date().toISOString(),
    };
  };

  /** Persiste nova card */
  const saveNewCard = (card) => {
    if (!card.boardId) throw new Error("saveNewCard requires boardId");
    if (!card.columnId) throw new Error("saveNewCard requires columnId");

    const newCard = {
      ...card,
      id: String(state.nextId),
      isNew: false,
    };

    dispatch({
      type: ACTIONS.ADD_CARD,
      card: newCard,
    });

    return newCard;
  };

  /**
   * Move card com suporte a DnD posicional
   */
  const moveCard = (cardId, { boardId, columnId, position, targetCardId } = {}) => {
    if (!cardId) throw new Error("moveCard requires cardId");

    dispatch({
      type: ACTIONS.MOVE_CARD,
      cardId,
      payload: {
        boardId,
        columnId,
        position,
        targetCardId,
      },
    });
  };

  /** Atualiza campos semânticos */
  const updateCard = (cardId, changes) => {
    dispatch({
      type: ACTIONS.UPDATE_CARD,
      cardId,
      changes,
    });
  };

  /** Remove card */
  const deleteCard = (cardId, boardId) => {
    if (!boardId) throw new Error("deleteCard requires boardId");

    dispatch({
      type: ACTIONS.DELETE_CARD,
      cardId,
      boardId,
    });
  };

  /** Limpa cards por escopo */
  const clearCards = ({ groupId, boardId } = {}) => {
    if (!groupId && !boardId) {
      throw new Error("clearCards requires groupId or boardId");
    }

    dispatch({
      type: ACTIONS.CLEAR_CARDS,
      groupId,
      boardId,
    });
  };

  return {
    addCard,
    saveNewCard,
    moveCard,
    updateCard,
    deleteCard,
    clearCards,
  };
}
