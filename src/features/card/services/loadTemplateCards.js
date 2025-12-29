let cachedCards = [];
let loadedOnce = false;

/**
 * Loads template cards from an external file with caching mechanism.
 *
 * On first call, fetches cards from the `assets/tarefas.txt`,
 * parses them, and caches the result. Subsequent calls return the
 * cached cards without making additional network requests.
 *
 * @async
 * @function loadTemplateCards
 * @returns {Promise<Array>}
 */
export async function loadTemplateCards() {
  if (loadedOnce && cachedCards.length > 0) return cachedCards;

  try {
    const base = import.meta.env.BASE_URL || "/";
    const response = await fetch(`${base}assets/tarefas.txt`);

    if (!response.ok) return [];

    const text = await response.text();
    const cards = parseCards(text);

    cachedCards = cards;
    loadedOnce = true;

    return cards;
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    return [];
  }
}

export function getCachedCards() {
  return cachedCards;
}

export function resetCardsCache() {
  cachedCards = [];
  loadedOnce = false;
}

function parseCards(text) {
  const cards = [];
  const regex =
    /Tarefa\s+(\d+):\s*(.*?)\r?\n- Status:\s*(.*?)\r?\nDescrição:\s*([\s\S]*?)(?=\r?\nTarefa\s+\d+:|$)/g;

  let match;

  while ((match = regex.exec(text)) !== null) {
    const templateId = Number(match[1]);

    cards.push({
      id: templateId,
      title: match[2].trim(),
      status: match[3].trim(),
      description: match[4].trim(),
    });
  }

  return cards;
}
