import React, { createContext, useContext, useReducer, useEffect } from "react";
import { loadTasksFromStorage } from "@task/services/taskPersistence";
import { initializeTasks } from "@task/services/initializeTaskTemplates";
import { taskReducer, ACTIONS } from "./taskReducer";
import { useTaskActions } from "./taskActions";

const TaskContext = createContext();

export const TaskProvider = ({ children, boardId = "kanban" }) => {
  if (!boardId) throw new Error("TaskProvider requer boardId");

  // Carrega tasks apenas do boardId especificado
  const saved = loadTasksFromStorage({ boardId }) || [];
  const initialNextId = saved.length > 0 ? Math.max(...saved.map(t => Number(t.id))) + 1 : 1;

  const [state, dispatch] = useReducer(taskReducer, {
    tasks: saved,
    nextId: initialNextId,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      const loaded = await initializeTasks();
      if (!mounted) return;

      const normalized = loaded.map((t, i) => ({
        ...t,
        id: t.id ?? String(i + 1),
        order: t.order ?? i,
        boardId: t.boardId ?? boardId,
      }));

      const existing = loadTasksFromStorage({ boardId }) || [];
      const merged = existing.length > 0 ? existing : normalized;

      const maxId = merged.reduce((max, t) => Math.max(max, Number(t.id)), 0);
      const calculatedNextId = maxId + 1;

      dispatch({ type: ACTIONS.SET_MIRROR_TASKS, tasks: merged, nextId: calculatedNextId });
    }

    load();
    return () => { mounted = false; };
  }, [boardId]);

  const actions = useTaskActions(state, dispatch);

  return (
    <TaskContext.Provider value={{ tasks: state.tasks, ...actions }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
