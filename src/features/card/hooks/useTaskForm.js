import { useState, useEffect } from "react";

export default function useTaskForm(task, columns) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(null);

  useEffect(() => {
    if (!task) return;

    setTitle(task.title || "");
    setDescription(task.description || "");

    if (task.columnId) {
      setColumnId(task.columnId);
      return;
    }

    if (columns?.length) {
      setColumnId(columns[0].id);
    }
  }, [task, columns]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    columnId,
    setColumnId,
  };
}
