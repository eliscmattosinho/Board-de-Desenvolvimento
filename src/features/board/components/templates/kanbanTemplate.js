export const kanbanTemplate = [
    {
        id: "to-do",
        title: "A Fazer",
        className: "kanban-column todo",
        style: {
            bg: "#3DD6B3",
            border: "transparent",
            color: "#EFEFEF"
        },
    },
    {
        id: "k-in-progress",
        title: "Em Progresso",
        className: "kanban-column progress",
        style: {
            bg: "#2C7FA3",
            border: "transparent",
            color: "#EFEFEF"
        },
    },
    {
        id: "k-done",
        title: "Concluído",
        className: "kanban-column done",
        style: {
            bg: "#2DA44A",
            border: "transparent",
            color: "#EFEFEF"
        },
    },
];

export default kanbanTemplate;
