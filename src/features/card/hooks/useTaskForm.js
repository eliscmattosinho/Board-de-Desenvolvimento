import { useState, useEffect } from "react";
import { getTaskColumns } from "@board/components/templates/templateMirror";

export default function useTaskForm(task, columns, activeBoard) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!task || !columns?.length) return;

    setTitle(task.title || "");
    setDescription(task.description || "");

    let { columnId, mirroredColumnId } = getTaskColumns(task);

    if (activeBoard !== task.boardId) {
      columnId = mirroredColumnId;
    }

    setStatus(columnId || columns[0]?.id || "");
  }, [task, columns, activeBoard]);

  return { title, setTitle, description, setDescription, status, setStatus };
}
