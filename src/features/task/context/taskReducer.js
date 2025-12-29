import {
  saveTasks,
  clearTasks as persistenceClearTasks,
} from "@task/services/taskPersistence";

import {
  getSyncedBoardsMap,
  getMirrorLocation,
} from "@board/utils/boardSyncUtils";

export const ACTIONS = {
  SET_MIRROR_TASKS: "SET_MIRROR_TASKS",
  ADD_TASK: "ADD_TASK",
  MOVE_TASK: "MOVE_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  CLEAR_TASKS: "CLEAR_TASKS",
};

const syncedBoardsMap = getSyncedBoardsMap();

/**
 * Persiste subconjunto de tasks:
 * - se existir groupId → salva por grupo
 * - senão → salva por boardId
 */
function persistSubset(tasks, target, isGroup) {
  const subset = isGroup
    ? tasks.filter(
        (t) => (syncedBoardsMap[t.boardId] ?? t.boardId) === target
      )
    : tasks.filter((t) => t.boardId === target);

  saveTasks(subset, isGroup ? { groupId: target } : { boardId: target });
}

/**
 * Reordena tasks de uma coluna específica
 */
function normalizeColumnOrder(tasks, boardId, columnId) {
  const scoped = tasks
    .filter(
      (t) =>
        t.boardId === boardId &&
        (t.columnId === columnId || t.mirrorColId === columnId)
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return tasks.map((t) => {
    const idx = scoped.findIndex((s) => s.id === t.id);
    return idx === -1 ? t : { ...t, order: idx };
  });
}

export function taskReducer(state, action) {
  switch (action.type) {
    /** Inicialização (load + merge) */
    case ACTIONS.SET_MIRROR_TASKS:
      return {
        ...state,
        tasks: action.tasks,
        nextId: action.nextId,
      };

    /* Adição de task*/
    case ACTIONS.ADD_TASK: {
      const task = action.task;
      const groupId = syncedBoardsMap[task.boardId];

      let mirrorColId = null;

      // Se o board pertence a um groupId, resolve espelhamento já na criação
      if (groupId && task.columnId) {
        const mirror = getMirrorLocation(task.boardId, task.columnId);
        mirrorColId = mirror.columnId ?? null;
      }

      const updated = [...state.tasks, { ...task, mirrorColId }];

      const normalized = normalizeColumnOrder(
        updated,
        task.boardId,
        task.columnId
      );

      persistSubset(
        normalized,
        groupId ?? task.boardId,
        Boolean(groupId)
      );

      return {
        tasks: normalized,
        nextId: state.nextId + 1,
      };
    }

    /* Move task entre colunas */
    case ACTIONS.MOVE_TASK: {
      const { taskId, payload } = action;
      const { boardId, columnId, position, targetTaskId } = payload;

      const original = state.tasks.find(
        (t) => String(t.id) === String(taskId)
      );
      if (!original) return state;

      const resolvedBoardId = boardId ?? original.boardId;
      const groupId = syncedBoardsMap[resolvedBoardId];
      const isGrouped = Boolean(groupId);
      const mirror = getMirrorLocation(resolvedBoardId, columnId);

      const boardsInScope = isGrouped
        ? Object.keys(syncedBoardsMap).filter(
            (b) => (syncedBoardsMap[b] ?? b) === groupId
          )
        : [original.boardId];

      let updated = state.tasks.map((t) => {
        if (!boardsInScope.includes(t.boardId)) return t;
        if (String(t.id) !== String(taskId)) return t;

        const nextColumnId =
          t.boardId === resolvedBoardId
            ? columnId
            : mirror.columnId ?? columnId;

        return {
          ...t,
          boardId:
            t.boardId === original.boardId ? resolvedBoardId : t.boardId,
          columnId: nextColumnId,
          mirrorColId: mirror.columnId ?? null,
        };
      });

      const columnTasks = updated
        .filter(
          (t) =>
            t.boardId === resolvedBoardId &&
            (t.columnId === columnId || t.mirrorColId === columnId)
        )
        .filter((t) => String(t.id) !== String(taskId))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      let insertIndex = 0;

      if (position === "before" || position === "after") {
        const targetIndex = columnTasks.findIndex(
          (t) => String(t.id) === String(targetTaskId)
        );
        if (targetIndex !== -1) {
          insertIndex =
            position === "before" ? targetIndex : targetIndex + 1;
        }
      }

      const movedTask = updated.find(
        (t) => String(t.id) === String(taskId)
      );

      columnTasks.splice(insertIndex, 0, movedTask);

      updated = updated.map((t) => {
        const idx = columnTasks.findIndex((c) => c.id === t.id);
        return idx === -1 ? t : { ...t, order: idx };
      });

      persistSubset(
        updated,
        groupId ?? resolvedBoardId,
        isGrouped
      );

      return { ...state, tasks: updated };
    }

    /** Atualização semântica */
    case ACTIONS.UPDATE_TASK: {
      const updated = state.tasks.map((t) =>
        String(t.id) === String(action.taskId)
          ? { ...t, ...action.changes }
          : t
      );

      const changed = updated.find(
        (t) => String(t.id) === String(action.taskId)
      );

      if (changed) {
        const groupId = syncedBoardsMap[changed.boardId];
        persistSubset(
          updated,
          groupId ?? changed.boardId,
          Boolean(groupId)
        );
      }

      return { ...state, tasks: updated };
    }

    /* Remoção de task */
    case ACTIONS.DELETE_TASK: {
      const removed = state.tasks.find(
        (t) => String(t.id) === String(action.taskId)
      );

      const updated = state.tasks.filter(
        (t) => String(t.id) !== String(action.taskId)
      );

      if (removed) {
        const normalized = normalizeColumnOrder(
          updated,
          removed.boardId,
          removed.columnId
        );

        const groupId = syncedBoardsMap[removed.boardId];
        persistSubset(
          normalized,
          groupId ?? removed.boardId,
          Boolean(groupId)
        );

        return { ...state, tasks: normalized };
      }

      return state;
    }

    /* Limpeza por groupId ou boardId */
    case ACTIONS.CLEAR_TASKS: {
      const { groupId, boardId } = action;

      const filtered = state.tasks.filter((t) => {
        const realGroup = syncedBoardsMap[t.boardId];
        if (groupId) return realGroup !== groupId;
        if (boardId) return t.boardId !== boardId;
        return true;
      });

      groupId
        ? persistenceClearTasks({ groupId })
        : persistenceClearTasks({ boardId });

      return { ...state, tasks: filtered };
    }

    default:
      return state;
  }
}
