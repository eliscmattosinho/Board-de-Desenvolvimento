import { useState, useEffect } from "react";
import { getDisplayStatus } from "@board/components/templates/templateMirror";

export default function useTaskForm(task, columns, activeView) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (!task || !columns?.length) return;

        setTitle(task.title || "");
        setDescription(task.description || "");

        const currentCol = columns.find(
            (col) => getDisplayStatus(task.status, activeView) === col.title
        );

        setStatus(currentCol?.id || columns[0]?.id || "");
    }, [task, columns, activeView]);

    return { title, setTitle, description, setDescription, status, setStatus };
}
