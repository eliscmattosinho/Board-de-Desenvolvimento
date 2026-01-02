let cachedCards = null;

export async function loadAndInitializeCards() {
  if (cachedCards) return cachedCards;

  try {
    const base = import.meta.env.BASE_URL || "/";
    const response = await fetch(`${base}assets/tarefas.txt`);
    const text = await response.text();

    const templates = parseCards(text).map((t, i) => ({
      ...t,
      isTemplateCard: true,
      order: i,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));

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