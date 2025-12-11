import { loadTemplateTasks } from "./loadTemplateTasks";
import { loadTasksFromStorage, saveTasks } from "./taskPersistence";
import { getTaskColumns } from "@board/components/templates/templateMirror";

// adk
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
    const loaded = await loadTemplateTasks();
    if (!loaded?.length) return [];

    // Carrega todas as tasks já existentes no grupo "shared"
    const existing = loadTasksFromStorage({ groupId: "shared" }) || [];

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

    // Remove duplicadas
    const filteredNew = normalized.filter(t => !existingSignatures.has(signatureForTask(t)));

    const merged = [...existing, ...filteredNew];

    // Salva explicitamente no groupId "shared"
    saveTasks(merged, { groupId: "shared" });

    return merged;
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
