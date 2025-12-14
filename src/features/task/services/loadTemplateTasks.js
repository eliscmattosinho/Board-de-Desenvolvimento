let cachedTasks = [];
let loadedOnce = false;

/**
 * Loads template tasks from an external file with caching mechanism.
 *
 * On first call, fetches tasks from the `assets/tarefas.txt`,
 * parses them, and caches the result. Subsequent calls return the
 * cached tasks without making additional network requests.
 *
 * @async
 * @function loadTemplateTasks
 * @returns {Promise<Array>}
 */
export async function loadTemplateTasks() {
  if (loadedOnce && cachedTasks.length > 0) return cachedTasks;

  try {
    const base = import.meta.env.BASE_URL || "/";
    const response = await fetch(`${base}assets/tarefas.txt`);

    if (!response.ok) return [];

    const text = await response.text();
    const tasks = parseTasks(text);

    cachedTasks = tasks;
    loadedOnce = true;

    return tasks;
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    return [];
  }
}

export function getCachedTasks() {
  return cachedTasks;
}

export function resetTasksCache() {
  cachedTasks = [];
  loadedOnce = false;
}

function parseTasks(text) {
  const tasks = [];
  const regex =
    /Tarefa\s+(\d+):\s*(.*?)\r?\n- Status:\s*(.*?)\r?\nDescrição:\s*([\s\S]*?)(?=\r?\nTarefa\s+\d+:|$)/g;

  let match;

  while ((match = regex.exec(text)) !== null) {
    const templateId = Number(match[1]);

    tasks.push({
      id: templateId,
      title: match[2].trim(),
      status: match[3].trim(),
      description: match[4].trim(),
    });
  }

  return tasks;
}
