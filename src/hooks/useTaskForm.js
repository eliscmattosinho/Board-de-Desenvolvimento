import { useState, useEffect } from "react";
import { getDisplayStatus } from "../js/boardUtils";

export default function useTaskForm(task, columns, activeView) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(""); // ID da coluna

    useEffect(() => {
        if (!task) return;

        setTitle(task.title || "");
        setDescription(task.description || "");

        const currentColId = columns.find(
            (col) => getDisplayStatus(task.status, activeView) === col.title
        )?.id;

        setStatus(currentColId || columns[0]?.id || "");
    }, [task, columns, activeView]);

    return { title, setTitle, description, setDescription, status, setStatus };
}
