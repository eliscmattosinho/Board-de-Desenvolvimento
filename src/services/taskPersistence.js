export function saveTasks(tasks) {
    sessionStorage.setItem("tasks", JSON.stringify(tasks));
    sessionStorage.setItem("tasksNextId", String(tasks.length + 1));
}

export function loadTasksFromStorage() {
    const saved = sessionStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : null;
}

export function clearTasksStorage() {
    sessionStorage.removeItem("tasks");
    sessionStorage.removeItem("tasksNextId");
}
