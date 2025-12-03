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
            const { taskId, status, targetTaskId, position } = action;
            const task = state.tasks.find(t => String(t.id) === String(taskId));
            if (!task) return state;

            const without = state.tasks.filter(t => String(t.id) !== String(taskId));
            const destTasks = without.filter(t => t.status === status && t.boardId === task.boardId);

            let insertIndex = destTasks.length;
            if (targetTaskId) {
                const idx = destTasks.findIndex(t => String(t.id) === String(targetTaskId));
                if (idx !== -1) insertIndex = position === "below" ? idx + 1 : idx;
            }

            const updatedTask = { ...task, status };
            const reordered = [
                ...without.slice(0, insertIndex),
                updatedTask,
                ...without.slice(insertIndex)
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
