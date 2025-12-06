import { ACTIONS } from "./columnReducer";
import { getMirrorColumnId } from "@board/utils/boardSyncUtils";

export function columnActions(dispatch) {
    const addColumn = (view, index, columnData) => {
        dispatch({ type: ACTIONS.ADD_COLUMN, view, index, columnData });
    };

    const removeColumn = (view, id) => {
        dispatch({ type: ACTIONS.REMOVE_COLUMN, view, id });
    };

    const updateColumnInfo = (view, id, newData) => {
        dispatch({ type: ACTIONS.UPDATE_COLUMN_INFO, view, id, newData });
    };

    const updateColumnStyle = (view, id, newData) => {
        dispatch({ type: ACTIONS.UPDATE_COLUMN_STYLE, view, id, newData });
    };

    const addTemplateColumn = (view, index, templateColumn) => {
        addColumn(view, index, { ...templateColumn, isTemplate: true });

        const mirrorView = view === "kanban" ? "scrum" : "kanban";
        const mirrorId = getMirrorColumnId(view, templateColumn.id);

        if (mirrorId) {
            const mirroredColumn = { ...templateColumn, id: mirrorId, isTemplate: true };
            addColumn(mirrorView, index || 0, mirroredColumn);
        }
    };

    return { addColumn, removeColumn, updateColumnInfo, updateColumnStyle, addTemplateColumn };
}
