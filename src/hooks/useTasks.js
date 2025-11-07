import { useState, useEffect } from "react";
import { initializeTasks } from "../js/initializeTasks";
import { columnIdToCanonicalStatus } from "../js/boardUtils";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let mounted = true;
    initializeTasks().then((initial) => {
      if (!mounted) return;
      const withOrder = (initial || []).map((t, i) => ({ order: i, ...t }));
      setTasks(withOrder);
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

  const addTask = (columnId = null, activeView = "kanban") => {
    // Coluna padrão caso não seja passada
    const colId = columnId;
    const canonicalStatus = colId ? columnIdToCanonicalStatus(colId) : "Backlog";

    const newTask = {
      id: String(tasks.length + 1), // ID baseado no total de tasks
      title: "",
      description: "",
      status: canonicalStatus,
      order: tasks.length,
      isNew: true,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => {
      const updated = [...prev, newTask];
      persist(updated);
      return updated;
    });

    return newTask;
  };

  /**
   * Move um card para outra coluna ou dentro da mesma coluna,
   * respeitando a posição "above" ou "below" do target card
   */
  const moveTask = (taskId, canonicalStatus, targetTaskId = null, position = null) => {
    setTasks((prev) => {
      const task = prev.find((t) => String(t.id) === String(taskId));
      if (!task) return prev;

      // Remove task do array original
      const without = prev.filter((t) => String(t.id) !== String(taskId));

      // Filtra tasks da coluna destino
      const destTasks = without.filter((t) => t.status === canonicalStatus);

      // Define índice de inserção
      let insertIndex = destTasks.length;
      if (targetTaskId) {
        const idx = destTasks.findIndex((t) => String(t.id) === String(targetTaskId));
        if (idx !== -1) insertIndex = position === "below" ? idx + 1 : idx;
      }

      const updatedTask = { ...task, status: canonicalStatus };

      // Reconstrói lista completa mantendo ordem
      const reordered = [
        ...without.slice(0, insertIndex),
        updatedTask,
        ...without.slice(insertIndex),
      ].map((t, i) => ({ ...t, order: i }));

      persist(reordered);
      return reordered;
    });
  };

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
      const updated = prev
        .filter((t) => String(t.id) !== String(taskId))
        .map((t, i) => ({ ...t, order: i }));
      persist(updated);
      return updated;
    });
  };

  const clearTasks = () => {
    setTasks([]);
    try {
      localStorage.removeItem("tasks");
    } catch (e) {
      console.warn("Não foi possível limpar tasks do localStorage", e);
    }
  };

  return [tasks, addTask, moveTask, updateTask, deleteTask, clearTasks];
}
