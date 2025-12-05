const mirrorDefinitions = {
  // fazer espelhamento do zero para comportar/distingir feature de novos boards e colunas?
  
  kanban: {
    columns: [
      { id: "to-do", title: "A Fazer", style: { bg: "#3DD6B3", color: "#EFEFEF" } },
      { id: "k-in-progress", title: "Em Progresso", style: { bg: "#2C7FA3", color: "#EFEFEF" } },
      { id: "k-done", title: "Concluído", style: { bg: "#2DA44A", color: "#EFEFEF" } },
    ],
    displayStatusMap: {
      Backlog: "A Fazer",
      "Sprint Backlog": "A Fazer",
      "Em Progresso": "Em Progresso",
      Revisão: "Em Progresso",
      Concluído: "Concluído",
    },
  },
  scrum: {
    columns: [
      { id: "backlog", title: "Backlog", style: { border: "#2C7FA3", color: "#2C7FA3" } },
      { id: "sprint-backlog", title: "Sprint Backlog", style: { bg: "#3DD6B3", color: "#EFEFEF" } },
      { id: "s-in-progress", title: "Em Progresso", style: { bg: "#2C7FA3", color: "#EFEFEF" } },
      { id: "review", title: "Revisão", style: { border: "#2DA44A", color: "#2DA44A" } },
      { id: "s-done", title: "Concluído", style: { bg: "#2DA44A", color: "#EFEFEF" } },
    ],
    displayStatusMap: null,
  },
};

export const canonicalStatuses = ["Backlog", "Sprint Backlog", "Em Progresso", "Revisão", "Concluído"];

export const boardTemplates = Object.fromEntries(
  Object.entries(mirrorDefinitions).map(([key, val]) => [key, val.columns])
);

// Função para retornar o status exibido conforme board
export const getDisplayStatus = (taskStatus, view) => {
  const map = mirrorDefinitions[view]?.displayStatusMap;
  return map?.[taskStatus] || taskStatus;
};

// Mapas de espelhamento entre Kanban e Scrum
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

const statusToColumn = {
  Backlog: { scrum: "backlog", kanban: "to-do" },
  "Sprint Backlog": { scrum: "sprint-backlog", kanban: "to-do" },
  "Em Progresso": { scrum: "s-in-progress", kanban: "k-in-progress" },
  Revisão: { scrum: "review", kanban: "k-in-progress" },
  Concluído: { scrum: "s-done", kanban: "k-done" },
};

// Funções utilitárias
export const resolveBoardColumnsForTask = (taskStatus) => {
  const map = statusToColumn[taskStatus];
  if (!map) return { scrum: null, kanban: null };
  return { scrum: map.scrum, kanban: map.kanban };
};

export const columnIdToCanonicalStatus = (id) => {
  const map = {
    "to-do": "Backlog",
    "k-in-progress": "Em Progresso",
    "k-done": "Concluído",
    backlog: "Backlog",
    "sprint-backlog": "Sprint Backlog",
    "s-in-progress": "Em Progresso",
    review: "Revisão",
    "s-done": "Concluído",
  };
  return map[id] || id;
};

export const getMirrorColumnId = (view, columnId) => columnMirrorMap[view]?.[columnId] || null;

export const isMirrorBoard = (boardId) => {
  return mirrorDefinitions.hasOwnProperty(boardId);
};
