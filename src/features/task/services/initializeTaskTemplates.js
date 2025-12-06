import { loadTasks } from "./loadTemplateTasks";
import { loadTasksFromStorage, saveTasks } from "./taskPersistence";
import { getTaskColumns } from "@board/components/templates/templateMirror";

/**
 * Helper: cria uma "assinatura" simples para uma task (para dedupe por conteúdo)
 */
function signatureForTask(t) {
  const title = String(t.title || "").trim();
  const desc = String(t.description || "").trim();
  return `${title}|${desc}`;
}

/**
 * Gera um id único baseado em timestamp + índice, troca para muiu?
 */
function generateUniqueId(i) {
  return `${Date.now()}-${i}`;
}

export async function initializeTasks() {
  try {
    const loaded = await loadTasks();
    if (!loaded?.length) return [];

    // Normaliza tasks com boardId e mirroredColumnId
    const normalized = loaded.map((t, i) => {
      const { boardId, columnId, mirroredColumnId } = getTaskColumns(t);

      return {
        id: String(i + 1),
        title: t.title || "Sem título",
        description: t.description || "Sem descrição",
        status: t.status || "Sem status",
        columnId,
        mirroredColumnId,
        order: i,
        boardId,
      };
    });

    const existing = loadTasksFromStorage() || [];

    // Cria conjunto de assinaturas das tasks existentes para dedupe por conteúdo
    const existingSignatures = new Set(existing.map(signatureForTask));
    const existingIds = new Set(existing.map(t => t.id));

    // Filtrar normalized:
    // - Se assinatura já existe, ignorar (evitar duplicata de conteúdo)
    // - Se id (muito improvável) existir => gerar novo id
    const filteredNew = normalized.map((t) => {
      const sig = signatureForTask(t);
      if (existingSignatures.has(sig)) {
        return null;
      }
      // garantir id único
      if (existingIds.has(t.id)) {
        // novo id único, @TODO simplificar
        t.id = `${t.id}-${Math.random().toString(36).slice(2, 8)}`;
      }
      return t;
    }).filter(Boolean);

    const merged = [
      ...existing,
      ...filteredNew
    ];

    saveTasks(merged);

    // Logging mínimo para debug (pode ser removido)
    console.debug(`[initializeTasks] loaded=${loaded.length} existing=${existing.length} added=${filteredNew.length}`);

    // Retorna todas as tasks normalizadas
    return merged;
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
