import { getContrastColor } from "@column/utils/colorUtils";

export const createStyle = (applyTo, color) =>
    applyTo === "fundo"
        ? { bg: color, border: "transparent", color: getContrastColor(color) }
        : { bg: "transparent", border: color, color };

export const generateColumnId = (isTemplate, id) =>
    isTemplate ? id : crypto.randomUUID(); // ID único para colunas custom

export const mirrorBoard = (boardId) =>
    boardId === "kanban" ? "scrum" : "kanban";
