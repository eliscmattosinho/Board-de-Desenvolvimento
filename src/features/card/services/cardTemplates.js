import { resolveInitialCardLocation } from "@/features/board/domain/cardBoardResolver";

let cachedCards = null;

async function loadAndInitializeCards() {
  if (cachedCards) return cachedCards;

  try {
    const base = import.meta.env.BASE_URL || "/";
    const text = await (await fetch(`${base}assets/tarefas.txt`)).text();

    const templates = parseCards(text).map((t, i) => {
      const { boardId, columnId } = resolveInitialCardLocation(t);

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,

        boardId,
        columnId,
        order: i,

        isTemplateCard: true,

        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    });

    cachedCards = templates;
    return templates;
  } catch (err) {
    console.error("Erro ao carregar tarefas:", err);
    return [];
  }
}

function parseCards(text) {
  return text
    .split(/\r?\n(?=Tarefa \d+:)/)
    .map((block) => {
      const lines = block.split(/\r?\n/).map((l) => l.trim());
      const idMatch = lines[0]?.match(/Tarefa (\d+):\s*(.*)/);
      const statusMatch = lines[1]?.match(/- Status:\s*(.*)/);
      const descriptionMatch = lines
        .slice(2)
        .join("\n")
        .match(/Descrição:\s*([\s\S]*)/);

      return {
        id: idMatch?.[1] || "",
        title: idMatch?.[2] || "Sem título",
        status: statusMatch?.[1] || null,
        description: descriptionMatch?.[1] || "",
      };
    });
}

export function resetCardsCache() {
  cachedCards = null;
}

export default loadAndInitializeCards;
