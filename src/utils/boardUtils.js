// Status interno canônico
export const canonicalStatuses = [
  "Backlog",
  "Sprint Backlog",
  "Em Progresso",
  "Revisão",
  "Concluído",
];

// Mapas para exibição
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

// Retona status de exibição para a view
export const getDisplayStatus = (taskStatus, view) => {
  if (view === "kanban") return statusMapKanban[taskStatus] || taskStatus;
  return statusMapScrum[taskStatus] || taskStatus;
};

// Converte coluna para status canônico (para drag & drop)
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
