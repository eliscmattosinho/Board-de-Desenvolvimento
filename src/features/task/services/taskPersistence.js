import { syncedBoardsMap } from "@board/utils/boardSyncUtils";

/**
 * Constrói a chave usada no sessionStorage
 */
function storageKeyFor({ groupId = null, boardId = null } = {}) {
  if (groupId) return `tasks_group_${groupId}`;
  if (boardId) return `tasks_board_${boardId}`;

  throw new Error("storageKeyFor requires groupId or boardId");
}

/**
 * Salva um array de tasks no storage apropriado
 */
export function saveTasks(tasks, { groupId = null, boardId = null } = {}) {
  if (!Array.isArray(tasks)) {
    throw new Error("saveTasks expects an array of tasks");
  }

  const key = storageKeyFor({ groupId, boardId });
  sessionStorage.setItem(key, JSON.stringify(tasks));
}

/**
 * Carrega tasks do storage correto
 */
export function loadTasksFromStorage({ groupId = null, boardId = null } = {}) {
  const key = storageKeyFor({ groupId, boardId });
  const raw = sessionStorage.getItem(key);

  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Retorna o próximo ID sequencial
 * Sempre baseado no storage alvo (group ou board)
 */
export function getNextId({ groupId = null, boardId = null } = {}) {
  const tasks = loadTasksFromStorage({ groupId, boardId });
  if (!tasks.length) return 1;

  return (
    Math.max(
      ...tasks.map((t) => Number(t.id)).filter((n) => !Number.isNaN(n))
    ) + 1
  );
}

/**
 * Adiciona uma task ao storage correto
 */
export function addTask(task) {
  if (!task.boardId) {
    throw new Error("addTask requires task.boardId");
  }

  const groupId = syncedBoardsMap[task.boardId] ?? null;
  const opts = groupId ? { groupId } : { boardId: task.boardId };

  const tasks = loadTasksFromStorage(opts);
  const nextId = getNextId(opts);

  const newTask = {
    ...task,
    id: String(nextId),
  };

  tasks.push(newTask);
  saveTasks(tasks, opts);

  return newTask;
}

/**
 * Atualiza uma task existente
 * Usa o boardId da própria task para resolver o storage
 */
export function updateTask(updatedTask) {
  if (!updatedTask?.id) {
    throw new Error("updateTask requires task.id");
  }
  if (!updatedTask?.boardId) {
    throw new Error("updateTask requires task.boardId");
  }

  const groupId = syncedBoardsMap[updatedTask.boardId] ?? null;
  const opts = groupId ? { groupId } : { boardId: updatedTask.boardId };

  const tasks = loadTasksFromStorage(opts);
  const index = tasks.findIndex((t) => String(t.id) === String(updatedTask.id));

  if (index === -1) {
    throw new Error("Task not found in storage");
  }

  tasks[index] = {
    ...tasks[index],
    ...updatedTask,
  };

  saveTasks(tasks, opts);
  return tasks[index];
}

/**
 * Remove uma task do storage correto
 */
export function deleteTask(taskId, boardId) {
  if (!taskId) throw new Error("deleteTask requires taskId");
  if (!boardId) throw new Error("deleteTask requires boardId");

  const groupId = syncedBoardsMap[boardId] ?? null;
  const opts = groupId ? { groupId } : { boardId };

  const tasks = loadTasksFromStorage(opts);
  const filtered = tasks.filter((t) => String(t.id) !== String(taskId));

  saveTasks(filtered, opts);
  return filtered;
}

/**
 * Remove completamente o storage alvo
 * Nunca assume fallback automático
 */
export function clearTasks({ groupId = null, boardId = null } = {}) {
  if (!groupId && !boardId) {
    throw new Error("clearTasks requires groupId or boardId");
  }

  const key = storageKeyFor({ groupId, boardId });
  sessionStorage.removeItem(key);
  return [];
}
