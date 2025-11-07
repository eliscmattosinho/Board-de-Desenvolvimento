let cachedTasks = [];
let loadedOnce = false; // evita recarregar TXT várias vezes

export async function loadTasks() {
  if (loadedOnce && cachedTasks.length > 0) return cachedTasks;

  try {
    const response = await fetch(`${process.env.PUBLIC_URL || ''}/assets/tarefas.txt`);
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

// Função para resetar cache
export function resetTasksCache() {
  cachedTasks = [];
  loadedOnce = false;
}

function parseTasks(text) {
  const tasks = [];
  const regex = /Tarefa\s+(\d+):\s*(.*?)\r?\n- Status:\s*(.*?)\r?\nDescrição:\s*([\s\S]*?)(?=\r?\nTarefa\s+\d+:|$)/g;
  let match;
  let counter = 0;

  while ((match = regex.exec(text)) !== null) {
    counter++;
    const status = match[3].trim();
    tasks.push({
      id: `${counter}`, // substituído no hook
      title: match[2].trim(),
      status,
      description: match[4].trim(),
    });
  }
  return tasks;
}
