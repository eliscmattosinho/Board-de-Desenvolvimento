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
      t => (syncedBoardsMap[t.boardId] ?? t.boardId) === target
    )
    : tasks.filter(t => t.boardId === target);

  saveTasks(subset, isGroup ? { groupId: target } : { boardId: target });
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

      const updatedTask = {
        ...task,
        mirrorColId,
      };

      const updated = [...state.tasks, updatedTask];

      persistSubset(
        updated,
        groupId ?? task.boardId,
        Boolean(groupId)
      );

      return {
        tasks: updated,
        nextId: state.nextId + 1,
      };
    }

    /* Move task entre colunas */
    case ACTIONS.MOVE_TASK: {
      const { taskId, payload } = action;
      const { boardId, columnId } = payload;

      const original = state.tasks.find(
        t => String(t.id) === String(taskId)
      );
      if (!original) return state;

      const mirror = getMirrorLocation(boardId, columnId);
      const groupId = syncedBoardsMap[boardId];
      const isGrouped = Boolean(groupId);

      const boardsInScope = isGrouped
        ? Object.keys(syncedBoardsMap).filter(
          b => (syncedBoardsMap[b] ?? b) === groupId
        )
        : [original.boardId];

      const updated = state.tasks
        .map(t => {
          if (!boardsInScope.includes(t.boardId)) return t;
          if (String(t.id) !== String(taskId)) return t;

          const nextColumnId =
            t.boardId === boardId
              ? columnId
              : mirror.columnId ?? columnId;

          return {
            ...t,
            boardId: t.boardId === original.boardId ? boardId : t.boardId,
            columnId: nextColumnId,
            mirrorColId: mirror.columnId ?? null,
          };
        })
        .map((t, i) => ({ ...t, order: i }));

      persistSubset(
        updated,
        groupId ?? boardId,
        isGrouped
      );

      return { ...state, tasks: updated };
    }

    /** Atualização semântica */
    case ACTIONS.UPDATE_TASK: {
      const updated = state.tasks.map(t =>
        String(t.id) === String(action.taskId)
          ? { ...t, ...action.changes }
          : t
      );

      const changed = updated.find(
        t => String(t.id) === String(action.taskId)
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
      const updated = state.tasks
        .filter(t => String(t.id) !== String(action.taskId))
        .map((t, i) => ({ ...t, order: i }));

      const removed = state.tasks.find(
        t => String(t.id) === String(action.taskId)
      );

      if (removed) {
        const groupId = syncedBoardsMap[removed.boardId];
        persistSubset(
          updated,
          groupId ?? removed.boardId,
          Boolean(groupId)
        );
      }

      return { ...state, tasks: updated };
    }

    /* Limpeza por groupId ou boardId */
    case ACTIONS.CLEAR_TASKS: {
      const { groupId, boardId } = action;

      const filtered = state.tasks.filter(t => {
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
