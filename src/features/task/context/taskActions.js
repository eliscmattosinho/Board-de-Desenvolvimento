import { ACTIONS } from "./taskReducer";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";

/**
 * Criar actios que derivam groupId quando necessário
 */
export function useTaskActions(state, dispatch) {
  const addTask = (columnId = null, { boardId = "user", mirroredColumnId = null } = {}) => {
    const canonicalStatus = columnId;
    const tempId = `${state.nextId}`;

    return {
      id: tempId,
      title: "",
      description: "",
      status: canonicalStatus, // pensar melhor
      columnId: canonicalStatus,
      mirroredColumnId: mirroredColumnId ?? null,
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
    const task = state.tasks.find(t => String(t.id) === String(taskId));
    if (!task) return;

    const groupId = syncedBoardsMap[task.boardId] ?? task.boardId;

    if (typeof statusOrPayload === "object" && statusOrPayload !== null) {
      dispatch({
        type: ACTIONS.MOVE_TASK,
        taskId,
        payload: { ...statusOrPayload, groupId },
      });
    } else {
      dispatch({
        type: ACTIONS.MOVE_TASK,
        taskId,
        status: statusOrPayload,
        targetTaskId,
        position,
        groupId,
      });
    }
  };

  const updateTask = (taskId, changes) => {
    const task = state.tasks.find(t => String(t.id) === String(taskId));
    const groupId = task ? (syncedBoardsMap[task.boardId] ?? task.boardId) : null;
    dispatch({ type: ACTIONS.UPDATE_TASK, taskId, changes, groupId });
  };

  const deleteTask = (taskId) => {
    const task = state.tasks.find(t => String(t.id) === String(taskId));
    const groupId = task ? (syncedBoardsMap[task.boardId] ?? task.boardId) : null;
    dispatch({ type: ACTIONS.DELETE_TASK, taskId, groupId });
  };

  const clearTasks = (boardId = null) => {
    const groupId = syncedBoardsMap[boardId] ?? boardId;
    dispatch({ type: ACTIONS.CLEAR_TASKS, boardId: groupId });
  };

  return { addTask, saveNewTask, moveTask, updateTask, deleteTask, clearTasks };
}
