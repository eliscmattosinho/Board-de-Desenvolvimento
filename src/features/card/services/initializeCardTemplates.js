import { loadTemplateCards } from "./loadTemplateCards";
import { loadCardsFromStorage, saveCards } from "./cardPersistence";
import { getCardColumn } from "@board/components/templates/cardBoardResolver";
import { getMirrorLocation } from "@board/utils/boardSyncUtils";

function signatureForCard(t) {
  return `template:${t.id}`;
}

export async function initializeCards() {
  try {
    const loaded = await loadTemplateCards();
    if (!loaded?.length) return [];

    // Cards já persistidas no grupo "shared"
    const existing = loadCardsFromStorage({ groupId: "shared" }) || [];

    const existingSignatures = new Set(existing.map(signatureForCard));

    const normalized = loaded.map((t, i) => {
      // Define onde a card nasce
      const { boardId, columnId } = getCardColumn(t);

      // Define onde ela se espelha
      const mirror = getMirrorLocation(boardId, columnId);

      return {
        id: t.id,
        title: t.title || "Sem título",
        description: t.description || "Sem descrição",
        status: t.status || "Sem status",
        boardId,
        columnId,
        mirrorColId: mirror.columnId ?? null,
        order: i,
      };
    });

    // Remove duplicadas com base no templateId
    const filteredNew = normalized.filter(
      t => !existingSignatures.has(signatureForCard(t))
    );

    const merged = [...existing, ...filteredNew];

    // Salva explicitamente no groupId "shared"
    saveCards(merged, { groupId: "shared" });

    return merged;
  } catch (err) {
    console.error("Erro ao inicializar cards:", err);
    return [];
  }
}
