import { saveTasks, clearTasks as persistenceClearTasks } from "@task/services/taskPersistence";
import { getSyncedBoardsMap } from "@board/utils/boardSyncUtils";

export const ACTIONS = {
  SET_MIRROR_TASKS: "SET_MIRROR_TASKS",
  ADD_TASK: "ADD_TASK",
  MOVE_TASK: "MOVE_TASK",
  MOVE_MIRROR_TASK: "MOVE_MIRROR_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  CLEAR_TASKS: "CLEAR_TASKS",
};

const syncedBoardsMap = getSyncedBoardsMap();

/**
 * Helper: persiste apenas o subset correto (grupo ou board) em storage
 */
function persistSubset(updatedGlobal, target, isGroup = false) {
  if (isGroup) {
    const subset = updatedGlobal.filter(t => (syncedBoardsMap[t.boardId] ?? t.boardId) === target);
    saveTasks(subset, { groupId: target });
  } else {
    const subset = updatedGlobal.filter(t => t.boardId === target);
    saveTasks(subset, { boardId: target });
  }
}

export function taskReducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_MIRROR_TASKS:
      return { ...state, tasks: action.tasks, nextId: action.nextId };

    case ACTIONS.ADD_TASK: {
      const newTask = action.task;
      const updated = [...state.tasks, newTask];

      const groupId = syncedBoardsMap[newTask.boardId] ?? null;
      if (groupId) {
        persistSubset(updated, groupId, true);
      } else {
        persistSubset(updated, newTask.boardId, false);
      }

      return { tasks: updated, nextId: state.nextId + 1 };
    }

    case ACTIONS.MOVE_TASK: {
      const taskId = action.taskId ?? action.id;
      const payload = action.payload ?? {};
      const columnId = action.columnId ?? payload.columnId ?? null;
      const status = action.status ?? payload.status ?? null;
      const targetTaskId = action.targetTaskId ?? payload.targetTaskId ?? null;
      const position = action.position ?? payload.position ?? null;

      const task = state.tasks.find(t => String(t.id) === String(taskId));
      if (!task) return state;

      const without = state.tasks.filter(t => String(t.id) !== String(taskId));
      const destTasks = without.filter(t => t.boardId === task.boardId &&
        (columnId ? String(t.columnId) === String(columnId) : true) &&
        (status ? String(t.status) === String(status) : true)
      );

      let insertIndex = targetTaskId ? destTasks.findIndex(t => String(t.id) === String(targetTaskId)) : destTasks.length;
      if (insertIndex === -1) insertIndex = destTasks.length;

      const updatedTask = { ...task, ...(status ? { status } : {}), ...(columnId ? { columnId } : {}) };

      let globalInsertPos = without.length;
      if (destTasks.length > 0 && insertIndex < destTasks.length) {
        const destTaskAtIndex = destTasks[insertIndex];
        const idx = without.findIndex(t => String(t.id) === String(destTaskAtIndex.id));
        globalInsertPos = idx !== -1 ? idx : without.length;
      }

      const reordered = [
        ...without.slice(0, globalInsertPos),
        updatedTask,
        ...without.slice(globalInsertPos)
      ].map((t, i) => ({ ...t, order: i }));

      const targetGroup = syncedBoardsMap[updatedTask.boardId] ?? null;
      if (targetGroup) {
        persistSubset(reordered, targetGroup, true);
      } else {
        persistSubset(reordered, updatedTask.boardId, false);
      }

      return { ...state, tasks: reordered };
    }

    // como que posso fazer sem duplicar/sobrecarregar? assinatura fantasma?
    case ACTIONS.MOVE_MIRROR_TASK: {
      const { taskId, payload = {} } = action;
      const columnId = action.columnId ?? payload.columnId ?? null;
      const status = action.status ?? payload.status ?? null;

      const original = state.tasks.find(t => String(t.id) === String(taskId));
      if (!original) return state;

      const groupId = syncedBoardsMap[original.boardId] ?? original.boardId;
      const boardsInGroup = Object.keys(syncedBoardsMap).filter(b => (syncedBoardsMap[b] ?? b) === groupId);

      let updated = state.tasks.map(t => {
        const belongs = boardsInGroup.includes(t.boardId);
        const isSameTask = String(t.id) === String(taskId);

        if (!belongs) return t;
        if (isSameTask) return { ...t, ...(status ? { status } : {}), ...(columnId ? { columnId } : {}) };
        if (t.sourceTaskId && String(t.sourceTaskId) === String(original.id)) return { ...t, status: status ?? t.status, columnId: columnId ?? t.columnId };
        return t;
      });

      updated = updated.map((t, i) => ({ ...t, order: i }));
      persistSubset(updated, groupId, true);

      return { ...state, tasks: updated };
    }

    case ACTIONS.UPDATE_TASK: {
      const { taskId, changes } = action;
      const updated = state.tasks.map(t => String(t.id) === String(taskId) ? { ...t, ...changes } : t);

      const updatedTask = updated.find(t => String(t.id) === String(taskId));
      if (updatedTask) {
        const groupId = syncedBoardsMap[updatedTask.boardId] ?? null;
        if (groupId) {
          persistSubset(updated, groupId, true);
        } else {
          persistSubset(updated, updatedTask.boardId, false);
        }
      }

      return { ...state, tasks: updated };
    }

    case ACTIONS.DELETE_TASK: {
      const { taskId } = action;
      const updated = state.tasks.filter(t => String(t.id) !== String(taskId)).map((t, i) => ({ ...t, order: i }));

      const removedTask = state.tasks.find(t => String(t.id) === String(taskId));
      if (removedTask) {
        const groupId = syncedBoardsMap[removedTask.boardId] ?? null;
        if (groupId) {
          persistSubset(updated, groupId, true);
        } else {
          persistSubset(updated, removedTask.boardId, false);
        }
      }

      return { ...state, tasks: updated };
    }

    case ACTIONS.CLEAR_TASKS: {
      const { groupId, boardId } = action;
      if (!groupId && !boardId) return state;

      const updated = state.tasks.filter(t => {
        const realGroup = syncedBoardsMap[t.boardId] ?? t.groupId ?? null;
        if (groupId) return realGroup !== groupId;
        if (boardId) return t.boardId !== boardId;
        return true;
      });

      if (groupId) persistenceClearTasks({ groupId });
      else if (boardId) persistenceClearTasks({ boardId });

      return { ...state, tasks: updated };
    }

    default:
      return state;
  }
}
