import React, { createContext, useContext, useReducer, useEffect } from "react";

import { loadTasksFromStorage } from "@task/services/taskPersistence";
import { initializeTasks } from "@task/services/initializeTaskTemplates";
import { taskReducer, ACTIONS } from "./taskReducer";
import { useTaskActions } from "./taskActions";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";

const TaskContext = createContext(null);

export const TaskProvider = ({ children, boardId = "kanban" }) => {
  if (!boardId) {
    throw new Error("TaskProvider requires boardId");
  }

  /**
   * Define escopo de persistência
   * Boards sincronizados compartilham groupId
   */
  const groupId = syncedBoardsMap[boardId] ?? null;
  const loadOpts = groupId ? { groupId } : { boardId };

  /**
   * Estado inicial vindo do storage
   */
  const saved = loadTasksFromStorage(loadOpts) || [];

  const initialNextId =
    saved.length > 0 ? Math.max(...saved.map((t) => Number(t.id))) + 1 : 1;

  const [state, dispatch] = useReducer(taskReducer, {
    tasks: saved,
    nextId: initialNextId,
  });

  /**
   * Inicialização de templates
   * Executa apenas uma vez por boardId
   */
  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const initialized = await initializeTasks();
      if (!mounted) return;

      /**
       * Sempre prioriza o que já está persistido.
       * Templates só entram se storage estiver vazio.
       */
      const persisted = loadTasksFromStorage(loadOpts) || [];

      const source =
        persisted.length > 0
          ? persisted
          : initialized.map((t, i) => ({
            ...t,
            id: String(t.id ?? i + 1),
            order: t.order ?? i,
          }));

      const maxId = source.reduce((max, t) => Math.max(max, Number(t.id)), 0);

      dispatch({
        type: ACTIONS.SET_MIRROR_TASKS,
        tasks: source,
        nextId: maxId + 1,
      });
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [boardId, groupId]);

  /**
   * Actions desacopladas da lógica estrutural
   */
  const actions = useTaskActions(state, dispatch);

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        ...actions,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

/**
 * Hook público
 */
export const useTasksContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTasksContext must be used within TaskProvider");
  }
  return ctx;
};
