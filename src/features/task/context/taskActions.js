import { ACTIONS } from "./taskReducer";

export function useTaskActions(state, dispatch) {
  /**
   * Cria task temporária (UI only)
   */
  const addTask = (columnId = null, { boardId } = {}) => {
    if (!boardId) throw new Error("addTask requires boardId");

    const tempId = String(state.nextId);

    return {
      id: tempId,
      title: "",
      description: "",
      status: null,
      boardId,
      columnId,
      mirrorColId: null,
      order: state.tasks.length,
      isNew: true,
      createdAt: new Date().toISOString(),
    };
  };

  /** Persiste nova task */
  const saveNewTask = (task) => {
    if (!task.boardId) throw new Error("saveNewTask requires boardId");
    if (!task.columnId) throw new Error("saveNewTask requires columnId");

    const newTask = {
      ...task,
      id: String(state.nextId),
      isNew: false,
    };

    dispatch({
      type: ACTIONS.ADD_TASK,
      task: newTask,
    });

    return newTask;
  };

  /** Move task entre colunas */
  const moveTask = (taskId, { boardId, columnId }) => {
    if (!taskId) throw new Error("moveTask requires taskId");
    if (!boardId) throw new Error("moveTask requires boardId");

    dispatch({
      type: ACTIONS.MOVE_TASK,
      taskId,
      payload: {
        boardId,
        columnId,
      },
    });
  };

  /** Atualiza campos semânticos */
  const updateTask = (taskId, changes) => {
    dispatch({
      type: ACTIONS.UPDATE_TASK,
      taskId,
      changes,
    });
  };

  /** Remove task */
  const deleteTask = (taskId, boardId) => {
    if (!boardId) throw new Error("deleteTask requires boardId");

    dispatch({
      type: ACTIONS.DELETE_TASK,
      taskId,
      boardId,
    });
  };

  /** Limpa tasks por escopo */
  const clearTasks = ({ groupId, boardId } = {}) => {
    if (!groupId && !boardId) {
      throw new Error("clearTasks requires groupId or boardId");
    }

    dispatch({
      type: ACTIONS.CLEAR_TASKS,
      groupId,
      boardId,
    });
  };

  return {
    addTask,
    saveNewTask,
    moveTask,
    updateTask,
    deleteTask,
    clearTasks,
  };
}
