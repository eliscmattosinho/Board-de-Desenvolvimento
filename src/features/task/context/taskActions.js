import { ACTIONS } from "./taskReducer";
import { columnIdToCanonicalStatus } from "@board/components/templates/templateMirror";

export function useTaskActions(state, dispatch) {
    const addTask = (columnId = null, { boardId = "user" } = {}) => {
        const canonicalStatus = columnId ? columnIdToCanonicalStatus(columnId) : "Backlog";
        const tempId = `${state.nextId}`;
        return {
            id: tempId,
            title: "",
            description: "",
            status: canonicalStatus,
            columnId,
            order: state.tasks.length,
            isNew: true,
            createdAt: new Date().toISOString(),
            boardId,
        };
    };

    const saveNewTask = (task) => {
        const newTask = { ...task, id: String(state.nextId), isNew: false };
        dispatch({ type: ACTIONS.ADD_TASK, task: newTask });
        return newTask;
    };

    const moveTask = (taskId, statusOrPayload, targetTaskId = null, position = null) => {
        if (typeof statusOrPayload === "object" && statusOrPayload !== null) {
            dispatch({
                type: ACTIONS.MOVE_TASK,
                taskId,
                payload: statusOrPayload,
            });
        } else {
            dispatch({
                type: ACTIONS.MOVE_TASK,
                taskId,
                status: statusOrPayload,
                targetTaskId,
                position,
            });
        }
    };

    const updateTask = (taskId, changes) =>
        dispatch({ type: ACTIONS.UPDATE_TASK, taskId, changes });

    const deleteTask = (taskId) => dispatch({ type: ACTIONS.DELETE_TASK, taskId });
    const clearTasks = (boardId = null) => dispatch({ type: ACTIONS.CLEAR_TASKS, boardId });

    return { addTask, saveNewTask, moveTask, updateTask, deleteTask, clearTasks };
}
