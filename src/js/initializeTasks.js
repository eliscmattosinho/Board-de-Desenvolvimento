import { canonicalStatuses } from "./boardUtils";
import { loadTasks } from "./tasksLoader";

/**
 * Inicializa tasks do backend fake ou sessionStorage
 * Garante IDs sequenciais curtos e persistência do próximo ID (testar dupl)
 */
export async function initializeTasks() {
  try {
    // Tenta carregar do sessionStorage
    const saved = sessionStorage.getItem("tasks");
    if (saved) {
      return JSON.parse(saved);
    }

    // Carrega do backend fake
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
    sessionStorage.setItem("tasks", JSON.stringify(normalized));
    sessionStorage.setItem("tasksNextId", String(normalized.length + 1));

    return normalized;
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
