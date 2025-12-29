import { syncedBoardsMap } from "@board/utils/boardSyncUtils";

/**
 * Constrói a chave usada no sessionStorage
 */
function storageKeyFor({ groupId = null, boardId = null } = {}) {
  if (groupId) return `cards_group_${groupId}`;
  if (boardId) return `cards_board_${boardId}`;

  throw new Error("storageKeyFor requires groupId or boardId");
}

/**
 * Salva um array de cards no storage apropriado
 */
export function saveCards(cards, { groupId = null, boardId = null } = {}) {
  if (!Array.isArray(cards)) {
    throw new Error("saveCards expects an array of cards");
  }

  const key = storageKeyFor({ groupId, boardId });
  sessionStorage.setItem(key, JSON.stringify(cards));
}

/**
 * Carrega cards do storage correto
 */
export function loadCardsFromStorage({ groupId = null, boardId = null } = {}) {
  const key = storageKeyFor({ groupId, boardId });
  const raw = sessionStorage.getItem(key);

  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Retorna o próximo ID sequencial
 * Sempre baseado no storage alvo (group ou board)
 */
export function getNextId({ groupId = null, boardId = null } = {}) {
  const cards = loadCardsFromStorage({ groupId, boardId });
  if (!cards.length) return 1;

  return (
    Math.max(
      ...cards.map((t) => Number(t.id)).filter((n) => !Number.isNaN(n))
    ) + 1
  );
}

/**
 * Adiciona uma card ao storage correto
 */
export function addCard(card) {
  if (!card.boardId) {
    throw new Error("addCard requires card.boardId");
  }

  const groupId = syncedBoardsMap[card.boardId] ?? null;
  const opts = groupId ? { groupId } : { boardId: card.boardId };

  const cards = loadCardsFromStorage(opts);
  const nextId = getNextId(opts);

  const newCard = {
    ...card,
    id: String(nextId),
  };

  cards.push(newCard);
  saveCards(cards, opts);

  return newCard;
}

/**
 * Atualiza uma card existente
 * Usa o boardId da própria card para resolver o storage
 */
export function updateCard(updatedCard) {
  if (!updatedCard?.id) {
    throw new Error("updateCard requires card.id");
  }
  if (!updatedCard?.boardId) {
    throw new Error("updateCard requires card.boardId");
  }

  const groupId = syncedBoardsMap[updatedCard.boardId] ?? null;
  const opts = groupId ? { groupId } : { boardId: updatedCard.boardId };

  const cards = loadCardsFromStorage(opts);
  const index = cards.findIndex((t) => String(t.id) === String(updatedCard.id));

  if (index === -1) {
    throw new Error("Card not found in storage");
  }

  cards[index] = {
    ...cards[index],
    ...updatedCard,
  };

  saveCards(cards, opts);
  return cards[index];
}

/**
 * Remove uma card do storage correto
 */
export function deleteCard(cardId, boardId) {
  if (!cardId) throw new Error("deleteCard requires cardId");
  if (!boardId) throw new Error("deleteCard requires boardId");

  const groupId = syncedBoardsMap[boardId] ?? null;
  const opts = groupId ? { groupId } : { boardId };

  const cards = loadCardsFromStorage(opts);
  const filtered = cards.filter((t) => String(t.id) !== String(cardId));

  saveCards(filtered, opts);
  return filtered;
}

/**
 * Remove completamente o storage alvo
 * Nunca assume fallback automático
 */
export function clearCards({ groupId = null, boardId = null } = {}) {
  if (!groupId && !boardId) {
    throw new Error("clearCards requires groupId or boardId");
  }

  const key = storageKeyFor({ groupId, boardId });
  sessionStorage.removeItem(key);
  return [];
}
