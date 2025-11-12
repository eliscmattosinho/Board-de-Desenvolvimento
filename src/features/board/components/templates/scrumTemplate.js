export const scrumTemplate = [
    {
        id: "backlog",
        title: "Backlog",
        className: "scrum-column backlog",
        style: {
            bg: "transparent",
            border: "#2C7FA3",
            color: "#2C7FA3"
        },
    },
    {
        id: "sprint-backlog",
        title: "Sprint Backlog",
        className: "scrum-column todo",
        style: {
            bg: "#3DD6B3",
            border: "transparent",
            color: "#EFEFEF"
        },
    },
    {
        id: "s-in-progress",
        title: "Em Progresso",
        className: "scrum-column progress",
        style: {
            bg: "#2C7FA3",
            border: "transparent",
            color: "#EFEFEF"
        },
    },
    {
        id: "review",
        title: "Revisão",
        className: "scrum-column review",
        style: {
            bg: "transparent",
            border: "#2DA44A",
            color: "#2DA44A"
        },
    },
    {
        id: "s-done",
        title: "Concluído",
        className: "scrum-column done",
        style: {
            bg: "#2DA44A",
            border: "transparent",
            color: "#EFEFEF"
        },
    },
];

export default scrumTemplate;
