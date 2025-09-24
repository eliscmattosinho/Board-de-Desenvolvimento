import { useState, useEffect } from "react";
import { initializeTasks } from "../js/initializeTasks";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let mounted = true;
    initializeTasks().then((initial) => {
      if (!mounted) return;
      setTasks(initial || []);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const persist = (updated) => {
    try {
      localStorage.setItem("tasks", JSON.stringify(updated));
    } catch (e) {
      // fail silently if localStorage isn’t available
      console.warn("Não foi possível persistir tasks no localStorage", e);
    }
  };

  const moveTask = (taskId, canonicalStatus) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        String(t.id) === String(taskId) ? { ...t, status: canonicalStatus } : t
      );
      persist(updated);
      return updated;
    });
  };

  // TODO: Implement debounce
  const updateTask = (taskId, changes) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        String(t.id) === String(taskId) ? { ...t, ...changes } : t
      );
      persist(updated);
      return updated;
    });
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => String(t.id) !== String(taskId));
      persist(updated);
      return updated;
    });
  };

  return [tasks, setTasks, moveTask, updateTask, deleteTask];
}
