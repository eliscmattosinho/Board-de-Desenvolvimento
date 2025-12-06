import { saveTasks } from "@task/services/taskPersistence";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";

export const ACTIONS = {
  SET_TASKS: "SET_TASKS",
  ADD_TASK: "ADD_TASK",
  MOVE_TASK: "MOVE_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  CLEAR_TASKS: "CLEAR_TASKS",
};

export function taskReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TASKS:
      return { ...state, tasks: action.tasks, nextId: action.nextId };

    case ACTIONS.ADD_TASK: {
      const newTask = action.task;
      const updated = [...state.tasks, newTask];
      saveTasks(updated);
      return { tasks: updated, nextId: state.nextId + 1 };
    }

    case ACTIONS.MOVE_TASK: {
      const taskId = action.taskId ?? action.id;
      const task = state.tasks.find(t => String(t.id) === String(taskId));
      if (!task) return state;

      const groupId = action.payload?.groupId ?? action.groupId ?? (syncedBoardsMap[task.boardId] ?? task.boardId);

      const columnId = action.columnId ?? action.payload?.columnId ?? null;
      const status = action.status ?? action.payload?.status ?? null;
      const targetTaskId = action.targetTaskId ?? action.payload?.targetTaskId ?? null;
      const position = action.position ?? action.payload?.position ?? null;

      const outside = state.tasks.filter(t => (syncedBoardsMap[t.boardId] ?? t.boardId) !== groupId);
      const groupTasks = state.tasks.filter(t => (syncedBoardsMap[t.boardId] ?? t.boardId) === groupId && String(t.id) !== String(taskId));

      const updatedTask = {
        ...task,
        ...(status ? { status } : {}),
        ...(columnId ? { columnId } : {}),
      };

      let insertIndex = groupTasks.length;
      if (targetTaskId) {
        const idx = groupTasks.findIndex(t => String(t.id) === String(targetTaskId));
        if (idx !== -1) insertIndex = position === "below" ? idx + 1 : idx;
      }

      // new group ordering
      const newGroupTasks = [
        ...groupTasks.slice(0, insertIndex),
        updatedTask,
        ...groupTasks.slice(insertIndex)
      ].map((t, i) => ({ ...t, order: i }));

      const reordered = [
        ...outside,
        ...newGroupTasks
      ];

      const normalized = reordered.map((t, i) => ({ ...t, order: i }));

      saveTasks(normalized);
      return { ...state, tasks: normalized };
    }

    case ACTIONS.UPDATE_TASK: {
      const groupId = action.groupId ?? (state.tasks.find(t => String(t.id) === String(action.taskId))?.boardId ?? null);

      const updated = state.tasks.map(t => {
        const taskGroup = syncedBoardsMap[t.boardId] ?? t.boardId;
        if (groupId && taskGroup === groupId && String(t.id) === String(action.taskId)) {
          return { ...t, ...action.changes };
        }

        if (!groupId && String(t.id) === String(action.taskId)) {
          return { ...t, ...action.changes };
        }
        return t;
      });

      saveTasks(updated);
      return { ...state, tasks: updated };
    }

    case ACTIONS.DELETE_TASK: {
      const groupId = action.groupId ?? (state.tasks.find(t => String(t.id) === String(action.taskId))?.boardId ?? null);

      const filtered = state.tasks
        .filter(t => {
          const taskGroup = syncedBoardsMap[t.boardId] ?? t.boardId;
          if (groupId) {
            return !(taskGroup === groupId && String(t.id) === String(action.taskId));
          }
          return String(t.id) !== String(action.taskId);
        })
        .map((t, i) => ({ ...t, order: i }));

      saveTasks(filtered);
      return { ...state, tasks: filtered };
    }

    case ACTIONS.CLEAR_TASKS: {
      const groupId = action.boardId ?? null;
      const filtered = state.tasks.filter(t => {
        const taskGroup = syncedBoardsMap[t.boardId] ?? t.boardId;
        return taskGroup !== groupId;
      });
      saveTasks(filtered);
      return { ...state, tasks: filtered };
    }

    default:
      return state;
  }
}
