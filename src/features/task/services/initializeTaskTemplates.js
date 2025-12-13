import { loadTemplateTasks } from "./loadTemplateTasks";
import { loadTasksFromStorage, saveTasks } from "./taskPersistence";
import { getTaskColumn } from "@board/components/templates/taskBoardResolver";
import { getMirrorLocation } from "@board/utils/boardSyncUtils";

function signatureForTask(t) {
  return `template:${t.id}`;
}

export async function initializeTasks() {
  try {
    const loaded = await loadTemplateTasks();
    if (!loaded?.length) return [];

    // Tasks já persistidas no grupo "shared"
    const existing = loadTasksFromStorage({ groupId: "shared" }) || [];

    const existingSignatures = new Set(existing.map(signatureForTask));

    const normalized = loaded.map((t, i) => {
      // Define onde a task nasce
      const { boardId, columnId } = getTaskColumn(t);

      // Define onde ela se espelha
      const mirror = getMirrorLocation(boardId, columnId);

      return {
        id: t.id,
        title: t.title || "Sem título",
        description: t.description || "Sem descrição",
        status: t.status || "Sem status",
        boardId,
        columnId,
        mirrorColId: mirror.columnId ?? null,
        order: i,
      };
    });

    // Remove duplicadas com base no templateId
    const filteredNew = normalized.filter(
      t => !existingSignatures.has(signatureForTask(t))
    );

    const merged = [...existing, ...filteredNew];

    // Salva explicitamente no groupId "shared"
    saveTasks(merged, { groupId: "shared" });

    return merged;
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
