import { syncedBoardsMap } from "@board/utils/boardSyncUtils";

/**
 * Constroi a chave usada no sessionStorage conforme groupId/boardId
 */
function storageKeyFor({ groupId = null, boardId = null } = {}) {
  if (groupId) return `tasks_group_${groupId}`;
  if (boardId) return `tasks_board_${boardId}`;
  throw new Error("storageKeyFor chamado sem groupId ou boardId");
}

/**
 * Salva um array de tasks no storage apropriado
 */
export function saveTasks(tasks, { groupId = null, boardId = null } = {}) {
  if (!Array.isArray(tasks)) {
    throw new Error("tasks precisa ser um array");
  }
  const key = storageKeyFor({ groupId, boardId });
  sessionStorage.setItem(key, JSON.stringify(tasks));
}

/**
 * Carrega tasks do storage do grupo/board
 */
export function loadTasksFromStorage({ groupId = null, boardId = null } = {}) {
  const key = storageKeyFor({ groupId, boardId });
  const raw = sessionStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

export const loadTasks = (opts = {}) => loadTasksFromStorage(opts);

/**
 * Retorna próximo id sequencial para o storage alvo (group ou board).
 */
export function getNextId({ groupId = null, boardId = null } = {}) {
  const tasks = loadTasksFromStorage({ groupId, boardId });
  if (!tasks || tasks.length === 0) return 1;
  return Math.max(...tasks.map(t => Number(t.id))) + 1;
}

/**
 * Adiciona uma nova task determinando corretamente se o storage destino
 */
export function addTask(task) {
  if (!task.boardId) task.boardId = "user";

  const groupId = syncedBoardsMap[task.boardId] ?? null;
  const loadOpts = groupId ? { groupId } : { boardId: task.boardId };

  const tasks = loadTasksFromStorage(loadOpts);
  const nextId = getNextId(loadOpts);

  const newTask = { ...task, id: String(nextId) };
  tasks.push(newTask);

  saveTasks(tasks, loadOpts);
  return newTask;
}

/**
 * Atualiza uma task existente no storage correto (baseado em boardId da task).
 */
export function updateTask(updatedTask) {
  if (!updatedTask.id) throw new Error("Task precisa ter id");
  if (!updatedTask.boardId) throw new Error("Task precisa ter boardId");

  const groupId = syncedBoardsMap[updatedTask.boardId] ?? null;
  const opts = groupId ? { groupId } : { boardId: updatedTask.boardId };

  const tasks = loadTasksFromStorage(opts);
  const index = tasks.findIndex(t => String(t.id) === String(updatedTask.id));

  if (index === -1) throw new Error("Task não encontrada");
  tasks[index] = { ...tasks[index], ...updatedTask };

  saveTasks(tasks, opts);
  return tasks[index];
}

/**
 * Deleta task no storage correto.
 */
export function deleteTask(taskId, boardId) {
  if (!taskId) throw new Error("taskId requerido");
  if (!boardId) throw new Error("deleteTask requer boardId");

  const groupId = syncedBoardsMap[boardId] ?? null;
  const opts = groupId ? { groupId } : { boardId };

  const tasks = loadTasksFromStorage(opts);
  const filtered = tasks.filter(t => String(t.id) !== String(taskId));

  saveTasks(filtered, opts);
  return filtered;
}

/**
 * Clear: remove a key do storage de acordo com groupId/boardId.
 * Agora não há fallback para grupo shared.
 */
export function clearTasks({ groupId = null, boardId = null } = {}) {
  if (!groupId && !boardId) {
    throw new Error("clearTasks requer groupId ou boardId");
  }
  const key = storageKeyFor({ groupId, boardId });
  sessionStorage.removeItem(key);
  return [];
}
