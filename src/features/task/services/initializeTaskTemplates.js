import { loadTasks } from "./loadTemplateTasks";
import { loadTasksFromStorage, saveTasks } from "./taskPersistence";
import {
  boardTemplates,
  getDisplayStatus,
  columnIdToCanonicalStatus,
  resolveBoardColumnsForTask,
} from "@board/components/templates/templateMirror";

export async function initializeTasks() {
  try {
    const loaded = await loadTasks();
    if (!loaded || !loaded.length) return [];

    const normalized = loaded.map((t, i) => {
      const statusText = t.status?.trim() ?? "";
      const resolved = resolveBoardColumnsForTask(statusText);
      let boardId = "kanban";
      let columnId = null;

      if (resolved.scrum) {
        boardId = "scrum";
        columnId = resolved.scrum;
      } else if (resolved.kanban) {
        boardId = "kanban";
        columnId = resolved.kanban;
      } else {
        boardId = "kanban";
        columnId = boardTemplates["kanban"]?.[0]?.id ?? null;
      }

      const canonical = columnId ? columnIdToCanonicalStatus(columnId) : (statusText || "Backlog");

      return {
        id: String(i + 1),
        title: t.title || "Sem título",
        description: t.description || "Sem descrição",
        status: canonical,
        columnId,
        order: i,
        boardId,
      };
    });

    const existing = loadTasksFromStorage();
    let merged;
    if (existing && existing.length > 0) {
      const hasAnyTemplateBoard = existing.some(x => x.boardId === "kanban" || x.boardId === "scrum");
      merged = hasAnyTemplateBoard ? existing : [...existing, ...normalized];
    } else {
      merged = normalized;
    }

    saveTasks(merged);
    return merged.filter(t => t.boardId === "kanban" || t.boardId === "scrum");
  } catch (err) {
    console.error("Erro ao inicializar tasks:", err);
    return [];
  }
}
