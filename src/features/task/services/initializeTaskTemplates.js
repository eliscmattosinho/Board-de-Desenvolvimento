import { canonicalStatuses } from "@board/components/templates/templateMirror";
import { loadTasks } from "./loadTemplateTasks";
import { loadTasksFromStorage, saveTasks } from "./taskPersistence";

/**
 * Inicializa tasks do backend fake (templates Kanban)
 * Garante IDs sequenciais e boardId definido
 */
export async function initializeTasks() {
  const BOARD_ID = "kanban";

  try {
    const saved = loadTasksFromStorage(BOARD_ID);
    if (saved && saved.length > 0) return saved;

    const loaded = await loadTasks();
    if (!loaded || !loaded.length) return [];

    const normalized = loaded.map((t, i) => ({
      id: String(i + 1),
      title: t.title || "Sem título",
      description: t.description || "Sem descrição",
      status: canonicalStatuses.includes(t.status?.trim()) ? t.status.trim() : "Backlog",
      order: i,
      boardId: BOARD_ID,
    }));

    saveTasks(normalized);
    return normalized;
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
