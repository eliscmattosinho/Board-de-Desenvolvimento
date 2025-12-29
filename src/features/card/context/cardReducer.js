import {
  saveCards,
  clearCards as persistenceClearCards,
} from "@/features/card/services/cardPersistence";

import {
  getSyncedBoardsMap,
  getMirrorLocation,
} from "@board/utils/boardSyncUtils";

export const ACTIONS = {
  SET_MIRROR_CARDS: "SET_MIRROR_CARDS",
  ADD_CARD: "ADD_CARD",
  MOVE_CARD: "MOVE_CARD",
  UPDATE_CARD: "UPDATE_CARD",
  DELETE_CARD: "DELETE_CARD",
  CLEAR_CARDS: "CLEAR_CARDS",
};

const syncedBoardsMap = getSyncedBoardsMap();

/**
 * Persiste subconjunto de cards:
 * - se existir groupId → salva por grupo
 * - senão → salva por boardId
 */
function persistSubset(cards, target, isGroup) {
  const subset = isGroup
    ? cards.filter(
        (t) => (syncedBoardsMap[t.boardId] ?? t.boardId) === target
      )
    : cards.filter((t) => t.boardId === target);

  saveCards(subset, isGroup ? { groupId: target } : { boardId: target });
}

/**
 * Reordena cards de uma coluna específica
 */
function normalizeColumnOrder(cards, boardId, columnId) {
  const scoped = cards
    .filter(
      (t) =>
        t.boardId === boardId &&
        (t.columnId === columnId || t.mirrorColId === columnId)
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return cards.map((t) => {
    const idx = scoped.findIndex((s) => s.id === t.id);
    return idx === -1 ? t : { ...t, order: idx };
  });
}

export function cardReducer(state, action) {
  switch (action.type) {
    /** Inicialização (load + merge) */
    case ACTIONS.SET_MIRROR_CARDS:
      return {
        ...state,
        cards: action.cards,
        nextId: action.nextId,
      };

    /* Adição de card*/
    case ACTIONS.ADD_CARD: {
      const card = action.card;
      const groupId = syncedBoardsMap[card.boardId];

      let mirrorColId = null;

      // Se o board pertence a um groupId, resolve espelhamento já na criação
      if (groupId && card.columnId) {
        const mirror = getMirrorLocation(card.boardId, card.columnId);
        mirrorColId = mirror.columnId ?? null;
      }

      const updated = [...state.cards, { ...card, mirrorColId }];

      const normalized = normalizeColumnOrder(
        updated,
        card.boardId,
        card.columnId
      );

      persistSubset(
        normalized,
        groupId ?? card.boardId,
        Boolean(groupId)
      );

      return {
        cards: normalized,
        nextId: state.nextId + 1,
      };
    }

    /* Move card entre colunas */
    case ACTIONS.MOVE_CARD: {
      const { cardId, payload } = action;
      const { boardId, columnId, position, targetCardId } = payload;

      const original = state.cards.find(
        (t) => String(t.id) === String(cardId)
      );
      if (!original) return state;

      const resolvedBoardId = boardId ?? original.boardId;
      const groupId = syncedBoardsMap[resolvedBoardId];
      const isGrouped = Boolean(groupId);
      const mirror = getMirrorLocation(resolvedBoardId, columnId);

      const boardsInScope = isGrouped
        ? Object.keys(syncedBoardsMap).filter(
            (b) => (syncedBoardsMap[b] ?? b) === groupId
          )
        : [original.boardId];

      let updated = state.cards.map((t) => {
        if (!boardsInScope.includes(t.boardId)) return t;
        if (String(t.id) !== String(cardId)) return t;

        const nextColumnId =
          t.boardId === resolvedBoardId
            ? columnId
            : mirror.columnId ?? columnId;

        return {
          ...t,
          boardId:
            t.boardId === original.boardId ? resolvedBoardId : t.boardId,
          columnId: nextColumnId,
          mirrorColId: mirror.columnId ?? null,
        };
      });

      const columnCards = updated
        .filter(
          (t) =>
            t.boardId === resolvedBoardId &&
            (t.columnId === columnId || t.mirrorColId === columnId)
        )
        .filter((t) => String(t.id) !== String(cardId))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      let insertIndex = 0;

      if (position === "before" || position === "after") {
        const targetIndex = columnCards.findIndex(
          (t) => String(t.id) === String(targetCardId)
        );
        if (targetIndex !== -1) {
          insertIndex =
            position === "before" ? targetIndex : targetIndex + 1;
        }
      }

      const movedCard = updated.find(
        (t) => String(t.id) === String(cardId)
      );

      columnCards.splice(insertIndex, 0, movedCard);

      updated = updated.map((t) => {
        const idx = columnCards.findIndex((c) => c.id === t.id);
        return idx === -1 ? t : { ...t, order: idx };
      });

      persistSubset(
        updated,
        groupId ?? resolvedBoardId,
        isGrouped
      );

      return { ...state, cards: updated };
    }

    /** Atualização semântica */
    case ACTIONS.UPDATE_CARD: {
      const updated = state.cards.map((t) =>
        String(t.id) === String(action.cardId)
          ? { ...t, ...action.changes }
          : t
      );

      const changed = updated.find(
        (t) => String(t.id) === String(action.cardId)
      );

      if (changed) {
        const groupId = syncedBoardsMap[changed.boardId];
        persistSubset(
          updated,
          groupId ?? changed.boardId,
          Boolean(groupId)
        );
      }

      return { ...state, cards: updated };
    }

    /* Remoção de card */
    case ACTIONS.DELETE_CARD: {
      const removed = state.cards.find(
        (t) => String(t.id) === String(action.cardId)
      );

      const updated = state.cards.filter(
        (t) => String(t.id) !== String(action.cardId)
      );

      if (removed) {
        const normalized = normalizeColumnOrder(
          updated,
          removed.boardId,
          removed.columnId
        );

        const groupId = syncedBoardsMap[removed.boardId];
        persistSubset(
          normalized,
          groupId ?? removed.boardId,
          Boolean(groupId)
        );

        return { ...state, cards: normalized };
      }

      return state;
    }

    /* Limpeza por groupId ou boardId */
    case ACTIONS.CLEAR_CARDS: {
      const { groupId, boardId } = action;

      const filtered = state.cards.filter((t) => {
        const realGroup = syncedBoardsMap[t.boardId];
        if (groupId) return realGroup !== groupId;
        if (boardId) return t.boardId !== boardId;
        return true;
      });

      groupId
        ? persistenceClearCards({ groupId })
        : persistenceClearCards({ boardId });

      return { ...state, cards: filtered };
    }

    default:
      return state;
  }
}
