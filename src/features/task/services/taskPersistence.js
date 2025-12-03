/**
 * Persiste tasks no sessionStorage, diferenciando templates e tasks do usuário
 */

const STORAGE_KEY = "tasks";

/**
 * Salva todas as tasks no storage
 * @param {Array} tasks - lista completa de tasks
 */
export function saveTasks(tasks) {
    if (!Array.isArray(tasks)) throw new Error("tasks precisa ser um array");
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Carrega tasks do storage
 * @param {string|null} boardId - se definido, retorna apenas tasks deste board
 * @returns {Array}
 */
export function loadTasksFromStorage(boardId = null) {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const tasks = JSON.parse(saved);
    if (boardId) {
        return tasks.filter(t => t.boardId === boardId);
    }
    return tasks;
}

/**
 * Calcula o próximo ID sequencial para um board
 * @param {string|null} boardId - board específico, ou null para todas
 * @returns {number}
 */
export function getNextId(boardId = null) {
    const tasks = loadTasksFromStorage(boardId);
    if (tasks.length === 0) return 1;

    return Math.max(...tasks.map(t => Number(t.id))) + 1;
}

/**
 * Adiciona uma nova task ao storage
 * @param {object} task - task com boardId definido
 */
export function addTask(task) {
    if (!task.boardId) task.boardId = "user";
    const tasks = loadTasksFromStorage();
    const nextId = getNextId(task.boardId);

    const newTask = { ...task, id: String(nextId) };
    tasks.push(newTask);

    saveTasks(tasks);
    return newTask;
}

/**
 * Substitui ou atualiza uma task existente
 * @param {object} updatedTask
 */
export function updateTask(updatedTask) {
    if (!updatedTask.id) throw new Error("Task precisa ter id");
    const tasks = loadTasksFromStorage();
    const index = tasks.findIndex(t => String(t.id) === String(updatedTask.id));

    if (index === -1) throw new Error("Task não encontrada");
    tasks[index] = { ...tasks[index], ...updatedTask };

    saveTasks(tasks);
    return tasks[index];
}

/**
 * Remove task por id
 * @param {string|number} taskId
 */
export function deleteTask(taskId) {
    const tasks = loadTasksFromStorage();
    const filtered = tasks.filter(t => String(t.id) !== String(taskId));
    saveTasks(filtered);
    return filtered;
}

/**
 * Limpa tasks de um board específico (ex: templates ou user)
 * @param {string|null} boardId
 */
export function clearTasks(boardId = null) {
    if (!boardId) {
        sessionStorage.removeItem(STORAGE_KEY);
        return [];
    }

    const tasks = loadTasksFromStorage();
    const filtered = tasks.filter(t => t.boardId !== boardId);
    saveTasks(filtered);
    return filtered;
}
