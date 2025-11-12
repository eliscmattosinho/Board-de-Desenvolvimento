/**
 * Centralização do espelhamento entre Kanban e Scrum
 * - Cada coluna de um board conhece sua correspondente no outro
 * - Mantém status canônico como camada de abstração
 */

export const columnMirrorMap = {
  kanban: {
    "to-do": "backlog",
    "k-in-progress": "s-in-progress",
    "k-done": "s-done",
  },
  scrum: {
    backlog: "to-do",
    "sprint-backlog": "to-do",
    "s-in-progress": "k-in-progress",
    review: "k-in-progress",
    "s-done": "k-done",
  },
};

// Status canônico interno
export const canonicalStatuses = [
  "Backlog",
  "Sprint Backlog",
  "Em Progresso",
  "Revisão",
  "Concluído",
];

// Coluna → status canônico
export const columnIdToCanonicalStatus = (id) => ({
  "to-do": "Backlog",
  "k-in-progress": "Em Progresso",
  "k-done": "Concluído",
  backlog: "Backlog",
  "sprint-backlog": "Sprint Backlog",
  "s-in-progress": "Em Progresso",
  review: "Revisão",
  "s-done": "Concluído",
}[id] || id);

// Mapeamento de exibição
export const statusMapKanban = {
  Backlog: "A Fazer",
  "Sprint Backlog": "A Fazer",
  "Em Progresso": "Em Progresso",
  Revisão: "Em Progresso",
  Concluído: "Concluído",
};

export const statusMapScrum = {
  Backlog: "Backlog",
  "Sprint Backlog": "Sprint Backlog",
  "Em Progresso": "Em Progresso",
  Revisão: "Revisão",
  Concluído: "Concluído",
};

// Retorna o nome de exibição da coluna para o board atual
export const getDisplayStatus = (taskStatus, view) => {
  if (view === "kanban") return statusMapKanban[taskStatus] || taskStatus;
  return statusMapScrum[taskStatus] || taskStatus;
};

// Função utilitária para obter a coluna correspondente no board espelhado
export const getMirrorColumnId = (view, columnId) => {
  if (view === "kanban") return columnMirrorMap.kanban[columnId] || null;
  if (view === "scrum") return columnMirrorMap.scrum[columnId] || null;
  return null;
};
