import { saveTasks } from "@task/services/taskPersistence";

export const ACTIONS = {
    SET_TASKS: "SET_TASKS",
    ADD_TASK: "ADD_TASK",
    MOVE_TASK: "MOVE_TASK",
    UPDATE_TASK: "UPDATE_TASK",
    DELETE_TASK: "DELETE_TASK",
    CLEAR_TASKS: "CLEAR_TASKS",
};

const syncedBoardsMap = {
    kanban: "shared",
    scrum: "shared",
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
            const payload = action.payload ?? {};
            const columnId = action.columnId ?? payload.columnId ?? null;
            const status = action.status ?? payload.status ?? null;
            const targetTaskId = action.targetTaskId ?? payload.targetTaskId ?? null;
            const position = action.position ?? payload.position ?? null;

            const task = state.tasks.find(t => String(t.id) === String(taskId));
            if (!task) return state;

            const without = state.tasks.filter(t => String(t.id) !== String(taskId));

            const destTasks = without.filter(t => {
                const sameBoard = t.boardId === task.boardId;
                if (!sameBoard) return false;
                if (columnId) return String(t.columnId) === String(columnId);
                if (status) return String(t.status) === String(status);
                return false;
            });

            let insertIndex = destTasks.length;
            if (targetTaskId) {
                const idx = destTasks.findIndex(t => String(t.id) === String(targetTaskId));
                if (idx !== -1) insertIndex = position === "below" ? idx + 1 : idx;
            }

            const updatedTask = {
                ...task,
                ...(status ? { status } : {}),
                ...(columnId ? { columnId } : {}),
            };

            let globalInsertPos = without.length;
            if (destTasks.length === 0) {
                const lastSameBoardIdx = without.map((t, i) => ({ t, i }))
                    .filter(x => x.t.boardId === task.boardId)
                    .map(x => x.i)
                    .pop();
                globalInsertPos = (lastSameBoardIdx !== undefined) ? lastSameBoardIdx + 1 : without.length;
            } else {
                if (insertIndex < destTasks.length) {
                    const destTaskAtIndex = destTasks[insertIndex];
                    const globalIdx = without.findIndex(t => String(t.id) === String(destTaskAtIndex.id));
                    globalInsertPos = globalIdx !== -1 ? globalIdx : without.length;
                } else {
                    const lastDest = destTasks[destTasks.length - 1];
                    const globalIdx = without.findIndex(t => String(t.id) === String(lastDest.id));
                    globalInsertPos = globalIdx !== -1 ? globalIdx + 1 : without.length;
                }
            }

            const reordered = [
                ...without.slice(0, globalInsertPos),
                updatedTask,
                ...without.slice(globalInsertPos)
            ].map((t, i) => ({ ...t, order: i }));

            saveTasks(reordered);
            return { ...state, tasks: reordered };
        }

        case ACTIONS.UPDATE_TASK: {
            const { taskId, changes } = action;
            const updated = state.tasks.map(t =>
                String(t.id) === String(taskId) ? { ...t, ...changes } : t
            );
            saveTasks(updated);
            return { ...state, tasks: updated };
        }

        case ACTIONS.DELETE_TASK: {
            const { taskId } = action;
            const updated = state.tasks
                .filter(t => String(t.id) !== String(taskId))
                .map((t, i) => ({ ...t, order: i }));
            saveTasks(updated);
            return { ...state, tasks: updated };
        }

        case ACTIONS.CLEAR_TASKS: {
            const { boardId: groupId } = action;
            const updated = state.tasks.filter(t => {
                const taskGroup = syncedBoardsMap[t.boardId] ?? t.boardId;
                return taskGroup !== groupId;
            });
            saveTasks(updated);
            return { ...state, tasks: updated };
        }

        default:
            return state;
    }
}
