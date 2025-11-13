import { canonicalStatuses } from "../features/board/utils/boardUtils";
import { loadTasks } from "./tasksLoader";
import { loadTasksFromStorage, saveTasks } from "./taskPersistence";

/**
 * Inicializa tasks do backend fake ou sessionStorage
 * Garante IDs sequenciais curtos e persistência do próximo ID
 */
export async function initializeTasks() {
  try {
    // Tenta carregar do sessionStorage
    const saved = loadTasksFromStorage();
    if (saved && saved.length > 0) {
      return saved;
    }

    // Carrega do backend fake (TXT)
    const loaded = await loadTasks();
    if (!loaded || !loaded.length) return [];

    // Normaliza e cria IDs sequenciais curtos
    const normalized = loaded.map((t, i) => ({
      id: String(i + 1),
      title: t.title || "Sem título",
      description: t.description || "Sem descrição",
      status: canonicalStatuses.includes(t.status?.trim()) ? t.status.trim() : "Backlog",
      order: i,
    }));

    // Persiste tasks e próximo ID no sessionStorage
    saveTasks(normalized);

    return normalized;
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
