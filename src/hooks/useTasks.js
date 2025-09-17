import { useState, useEffect } from "react";
import { initializeTasks } from "../js/initializeTasks";
import { columnIdToCanonicalStatus } from "../js/boardUtils";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    initializeTasks().then(setTasks);
  }, []);

  const moveTask = (taskId, canonicalStatus) => {
    setTasks(prev => {
      const updated = prev.map(t =>
        t.id === taskId ? { ...t, status: canonicalStatus } : t
      );
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    });
  };

  return [tasks, setTasks, moveTask];
}
