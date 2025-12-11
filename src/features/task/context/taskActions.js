import { ACTIONS } from "./taskReducer";
import { boardTemplates } from "@board/components/templates/boardTemplates";

function columnIdToCanonicalStatus(columnId) {
  if (!columnId) return "Backlog";

  const boards = Object.keys(boardTemplates || {});
  for (let i = 0; i < boards.length; i++) {
    const cols = boardTemplates[boards[i]] || [];
    const col = cols.find(c => String(c.id) === String(columnId));
    if (col) return col.status || col.title || "Backlog";
  }

  return "Backlog";
}

export function useTaskActions(state, dispatch) {
  const addTask = (columnId = null, { boardId } = {}) => {
    if (!boardId) throw new Error("addTask requer boardId");
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
    if (!task.boardId) throw new Error("saveNewTask requer boardId");
    const newTask = { ...task, id: String(state.nextId), isNew: false };
    dispatch({ type: ACTIONS.ADD_TASK, task: newTask });
    return newTask;
  };

  const moveTask = (taskId, statusOrPayload, targetTaskId = null, position = null) => {
    if (typeof statusOrPayload === "object" && statusOrPayload !== null) {
      dispatch({ type: ACTIONS.MOVE_TASK, taskId, payload: statusOrPayload });
    } else {
      dispatch({ type: ACTIONS.MOVE_TASK, taskId, status: statusOrPayload, targetTaskId, position });
    }
  };

  const updateTask = (taskId, changes) => dispatch({ type: ACTIONS.UPDATE_TASK, taskId, changes });

  const deleteTask = (taskId, boardId) => {
    if (!boardId) throw new Error("deleteTask requer boardId");
    dispatch({ type: ACTIONS.DELETE_TASK, taskId, boardId });
  };

  const clearTasks = ({ groupId, boardId } = {}) => {
    if (!groupId && !boardId) throw new Error("clearTasks requer groupId ou boardId");
    dispatch({ type: ACTIONS.CLEAR_TASKS, groupId, boardId });
  };

  return { addTask, saveNewTask, moveTask, updateTask, deleteTask, clearTasks };
}
