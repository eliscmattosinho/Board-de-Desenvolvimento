export const boardTemplate = {
  kanban: {
    groupId: "shared", //group name, create more? feature: desativar espelhamento
    columns: [
      { id: "to-do", title: "A Fazer", status: "todo", style: { bg: "#3DD6B3", color: "#EFEFEF" } },
      { id: "k-in-progress", title: "Em Progresso", status: "in-progress", style: { bg: "#2C7FA3", color: "#EFEFEF" } },
      { id: "k-done", title: "Concluído", status: "done", style: { bg: "#2DA44A", color: "#EFEFEF" } },
    ]
  },
  scrum: {
    groupId: "shared",
    columns: [
      { id: "backlog", title: "Backlog", status: "todo", style: { border: "#2C7FA3", color: "#2C7FA3" } },
      { id: "sprint-backlog", title: "Sprint Backlog", status: "in-progress", style: { bg: "#3DD6B3", color: "#EFEFEF" } },
      { id: "s-in-progress", title: "Em Progresso", status: "in-progress", style: { bg: "#2C7FA3", color: "#EFEFEF" } },
      { id: "review", title: "Revisão", status: "in-progress", style: { border: "#2DA44A", color: "#2DA44A" } },
      { id: "s-done", title: "Concluído", status: "done", style: { bg: "#2DA44A", color: "#EFEFEF" } },
    ]
  },
};

export const boardTemplates = {
  kanban: boardTemplate.kanban.columns,
  scrum: boardTemplate.scrum.columns
};
