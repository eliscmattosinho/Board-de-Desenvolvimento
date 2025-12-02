import { ACTIONS } from "./columnReducer";
import { getMirrorColumnId } from "@board/components/templates/templateMirror";

export function columnActions(dispatch) {
    const addColumn = (view, index, columnData) => {
        dispatch({ type: ACTIONS.ADD_COLUMN, view, index, columnData });
    };

    const renameColumn = (view, id, newData) => {
        dispatch({ type: ACTIONS.RENAME_COLUMN, view, id, newData });
    };

    const removeColumn = (view, id) => {
        dispatch({ type: ACTIONS.REMOVE_COLUMN, view, id });
    };

    const addTemplateColumn = (view, index, templateColumn) => {
        // Adiciona coluna original
        addColumn(view, index, { ...templateColumn, isTemplate: true });

        // Adiciona coluna espelhada no outro board
        const mirrorView = view === "kanban" ? "scrum" : "kanban";
        const mirrorId = getMirrorColumnId(view, templateColumn.id);

        if (mirrorId) {
            const mirroredColumn = {
                ...templateColumn,
                id: mirrorId,
                isTemplate: true,
            };

            addColumn(mirrorView, (index || 0), mirroredColumn);
        }
    };

    return { addColumn, renameColumn, removeColumn, addTemplateColumn };
}
