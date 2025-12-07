import { loadTasks } from "./loadTemplateTasks";
import { loadTasksFromStorage, saveTasks } from "./taskPersistence";
import { getTaskColumns } from "@board/components/templates/templateMirror";

function signatureForTask(t) {
  const title = String(t.title || "").trim();
  const desc = String(t.description || "").trim();
  return `${title}|${desc}`;
}

function getNextSequentialId(existing) {
  if (!existing.length) return 1;

  // Filtra apenas IDs numéricos reais
  const numericIds = existing
    .map(t => Number(t.id))
    .filter(n => !isNaN(n) && n > 0);

  if (!numericIds.length) return 1;

  return Math.max(...numericIds) + 1;
}

export async function initializeTasks() {
  try {
    const loaded = await loadTasks();
    if (!loaded?.length) return [];

    const existing = loadTasksFromStorage() || [];

    // Construção do índice incremental
    let nextId = getNextSequentialId(existing);

    const existingSignatures = new Set(existing.map(signatureForTask));

    const normalized = loaded.map((t, i) => {
      const { boardId, columnId, mirroredColumnId } = getTaskColumns(t);

      return {
        id: nextId++,
        title: t.title || "Sem título",
        description: t.description || "Sem descrição",
        status: t.status || "Sem status",
        columnId,
        mirroredColumnId,
        order: i,
        boardId,
      };
    });

    // Remove tasks duplicadas por conteúdo
    const filteredNew = normalized.filter(t => {
      const sig = signatureForTask(t);
      return !existingSignatures.has(sig);
    });

    const merged = [...existing, ...filteredNew];

    saveTasks(merged);

    // console.debug(
    //   `[initializeTasks] loaded=${loaded.length} existing=${existing.length} added=${filteredNew.length}`
    // );

    return merged;
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
