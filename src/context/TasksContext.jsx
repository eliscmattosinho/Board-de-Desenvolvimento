import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { getCachedTasks, resetTasksCache } from "../js/tasksLoader";
import { initializeTasks } from "../js/initializeTasks";
import { columnIdToCanonicalStatus } from "../utils/boardUtils";

const TasksContext = createContext();

const ACTIONS = {
  SET_TASKS: "SET_TASKS",
  ADD_TASK: "ADD_TASK",
  MOVE_TASK: "MOVE_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  CLEAR_TASKS: "CLEAR_TASKS",
};

function tasksReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TASKS:
      return { ...state, tasks: action.tasks, nextId: action.nextId };
    case ACTIONS.ADD_TASK: {
      const newTask = action.task;
      const updated = [...state.tasks, newTask];
      sessionStorage.setItem("tasks", JSON.stringify(updated));
      sessionStorage.setItem("tasksNextId", String(state.nextId + 1));
      return { tasks: updated, nextId: state.nextId + 1 };
    }
    case ACTIONS.MOVE_TASK: {
      const { taskId, status, targetTaskId, position } = action;
      const task = state.tasks.find(t => String(t.id) === String(taskId));
      if (!task) return state;

      const without = state.tasks.filter(t => String(t.id) !== String(taskId));
      const destTasks = without.filter(t => t.status === status);

      let insertIndex = destTasks.length;
      if (targetTaskId) {
        const idx = destTasks.findIndex(t => String(t.id) === String(targetTaskId));
        if (idx !== -1) insertIndex = position === "below" ? idx + 1 : idx;
      }

      const updatedTask = { ...task, status };
      const reordered = [...without.slice(0, insertIndex), updatedTask, ...without.slice(insertIndex)]
        .map((t, i) => ({ ...t, order: i }));

      sessionStorage.setItem("tasks", JSON.stringify(reordered));
      return { ...state, tasks: reordered };
    }
    case ACTIONS.UPDATE_TASK: {
      const { taskId, changes } = action;
      const updated = state.tasks.map(t => String(t.id) === String(taskId) ? { ...t, ...changes } : t);
      sessionStorage.setItem("tasks", JSON.stringify(updated));
      return { ...state, tasks: updated };
    }
    case ACTIONS.DELETE_TASK: {
      const { taskId } = action;
      const updated = state.tasks
        .filter(t => String(t.id) !== String(taskId))
        .map((t, i) => ({ ...t, order: i }));
      sessionStorage.setItem("tasks", JSON.stringify(updated));
      return { ...state, tasks: updated };
    }
    case ACTIONS.CLEAR_TASKS:
      sessionStorage.removeItem("tasks");
      sessionStorage.removeItem("tasksNextId");
      resetTasksCache();
      return { tasks: [], nextId: 1 };
    default:
      return state;
  }
}

export const TasksProvider = ({ children }) => {
  const saved = sessionStorage.getItem("tasks");
  const initialTasks = saved ? JSON.parse(saved) : getCachedTasks();

  const initialNextId =
    initialTasks.length > 0
      ? Math.max(...initialTasks.map(t => Number(t.id))) + 1
      : 1;

  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: initialTasks,
    nextId: initialNextId,
  });

  // Load tasks from fake backend/sessionStorage on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      const loaded = await initializeTasks();
      if (!mounted) return;

      const normalized = loaded.map((t, i) => ({
        ...t,
        id: t.id ?? String(i + 1),
        order: t.order ?? i,
      }));

      const maxId = normalized.reduce((max, t) => Math.max(max, Number(t.id)), 0);
      const calculatedNextId = maxId + 1;

      dispatch({ type: ACTIONS.SET_TASKS, tasks: normalized, nextId: calculatedNextId });
    }

    load();
    return () => { mounted = false; };
  }, []);

  // Cria um draft de task temporária (sem consumir nextId)
  const addTask = useCallback((columnId = null) => {
    const canonicalStatus = columnId ? columnIdToCanonicalStatus(columnId) : "Backlog";
    const tempId = `${state.nextId}`;

    return {
      id: tempId,
      title: "",
      description: "",
      status: canonicalStatus,
      order: state.tasks.length,
      isNew: true,
      createdAt: new Date().toISOString(),
    };
  }, [state.nextId, state.tasks.length]);

  // Salva task oficial (ID real)
  const saveNewTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: String(state.nextId),
      isNew: false,
    };
    dispatch({ type: ACTIONS.ADD_TASK, task: newTask });
    return newTask;
  }, [state.nextId]);

  const moveTask = useCallback((taskId, status, targetTaskId = null, position = null) => {
    dispatch({ type: ACTIONS.MOVE_TASK, taskId, status, targetTaskId, position });
  }, []);

  const updateTask = useCallback((taskId, changes) => {
    dispatch({ type: ACTIONS.UPDATE_TASK, taskId, changes });
  }, []);

  const deleteTask = useCallback((taskId) => {
    dispatch({ type: ACTIONS.DELETE_TASK, taskId });
  }, []);

  const clearTasks = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_TASKS });
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks: state.tasks,
        addTask,
        saveNewTask,
        moveTask,
        updateTask,
        deleteTask,
        clearTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
