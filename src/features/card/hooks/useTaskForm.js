import { useState, useEffect } from "react";

export default function useTaskForm(task, columns) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(null);

  useEffect(() => {
    if (!task) return;

    setTitle(task.title || "");
    setDescription(task.description || "");

    // coluna vem diretamente da task
    setColumnId(
      task.columnId ??
      columns?.[0]?.id ??
      null
    );
  }, [task, columns]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    status: columnId,
    setStatus: setColumnId
  };
}
