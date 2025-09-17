import { canonicalStatuses } from "./boardUtils";
import { loadTasks } from "./tasksLoader";

export async function initializeTasks() {
  // Limpa storage antigo (se houver)
  localStorage.removeItem("tasks");

  try {
    const loaded = await loadTasks();
    if (!loaded || !loaded.length) return [];

    // Normaliza status e remove espaços extras
    const normalized = loaded.map((t, index) => {
      let status = t.status.trim();

      // Garante que o status é canônico
      if (!canonicalStatuses.includes(status)) {
        console.warn(`Task #${t.id} com status inválido: "${status}". Corrigindo para "Backlog".`);
        status = "Backlog";
      }

      return {
        id: t.id || `${index + 1}`,
        title: t.title.trim(),
        description: t.description?.trim() || "Sem descrição.",
        status,
      };
    });

    // Salva no localStorage
    localStorage.setItem("tasks", JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
