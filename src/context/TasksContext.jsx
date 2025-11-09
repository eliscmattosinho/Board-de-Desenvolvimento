import React, { createContext, useContext, useState, useEffect } from "react";

import { getCachedTasks, resetTasksCache } from "../js/tasksLoader";
import { initializeTasks } from "../js/initializeTasks";
import { columnIdToCanonicalStatus } from "../utils/boardUtils";


const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  // Estado inicial tenta usar sessionStorage, senão fallback para cachedTasks
  const saved = sessionStorage.getItem("tasks");
  const initialTasks = saved ? JSON.parse(saved) : getCachedTasks();

  const [tasks, setTasks] = useState(initialTasks);
  const [nextId, setNextId] = useState(
    initialTasks.length > 0
      ? Math.max(...initialTasks.map(t => Number(t.id))) + 1
      : 1
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      const loaded = await initializeTasks();
      if (!mounted) return;

      // Normaliza tasks
      const normalized = loaded.map((t, i) => ({
        ...t,
        id: t.id ?? String(i + 1),
        order: t.order ?? i,
      }));

      setTasks(normalized);

      const maxId = normalized.reduce((max, t) => Math.max(max, Number(t.id)), 0);
      const calculatedNextId = maxId + 1;
      setNextId(calculatedNextId);
      sessionStorage.setItem("tasksNextId", String(calculatedNextId));
    }

    load();
    return () => { mounted = false; };
  }, []);

  const persist = (updated) => {
    try { sessionStorage.setItem("tasks", JSON.stringify(updated)); }
    catch (e) { console.warn("Não foi possível persistir tasks no sessionStorage", e); }
  };

  const addTask = (columnId = null) => {
    const canonicalStatus = columnId ? columnIdToCanonicalStatus(columnId) : "Backlog";
    const newTask = {
      id: String(nextId),
      title: "",
      description: "",
      status: canonicalStatus,
      order: tasks.length,
      isNew: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    persist(updated);

    const newNextId = nextId + 1;
    setNextId(newNextId);
    sessionStorage.setItem("tasksNextId", String(newNextId));

    return newTask;
  };

  const moveTask = (taskId, canonicalStatus, targetTaskId = null, position = null) => {
    setTasks(prev => {
      const task = prev.find(t => String(t.id) === String(taskId));
      if (!task) return prev;

      const without = prev.filter(t => String(t.id) !== String(taskId));
      const destTasks = without.filter(t => t.status === canonicalStatus);

      let insertIndex = destTasks.length;
      if (targetTaskId) {
        const idx = destTasks.findIndex(t => String(t.id) === String(targetTaskId));
        if (idx !== -1) insertIndex = position === "below" ? idx + 1 : idx;
      }

      const updatedTask = { ...task, status: canonicalStatus };
      const reordered = [...without.slice(0, insertIndex), updatedTask, ...without.slice(insertIndex)]
        .map((t, i) => ({ ...t, order: i }));

      persist(reordered);
      return reordered;
    });
  };

  const updateTask = (taskId, changes) => {
    setTasks(prev => {
      const updated = prev.map(t => String(t.id) === String(taskId) ? { ...t, ...changes } : t);
      persist(updated);
      return updated;
    });
  };

  const deleteTask = (taskId) => {
    setTasks(prev => {
      const updated = prev.filter(t => String(t.id) !== String(taskId))
        .map((t, i) => ({ ...t, order: i }));
      persist(updated);
      return updated;
    });
  };

  const clearTasks = () => {
    setTasks([]);
    setNextId(1);

    try {
      sessionStorage.removeItem("tasks");
      sessionStorage.removeItem("tasksNextId");

      resetTasksCache();
    } catch (e) { console.warn(e); }
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, moveTask, updateTask, deleteTask, clearTasks }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
