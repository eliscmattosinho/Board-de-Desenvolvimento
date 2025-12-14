import { ACTIONS } from "./columnReducer";

export function columnActions(dispatch) {
    const createDispatch = (type) => (...args) => dispatch({ type, ...args });

    const addColumn = (boardId, index, columnData) => dispatch({
        type: ACTIONS.ADD_COLUMN,
        boardId,
        index,
        columnData,
    });

    const removeColumn = (boardId, id) => dispatch({ type: ACTIONS.REMOVE_COLUMN, boardId, id });

    const updateColumnInfo = (boardId, id, newData) => dispatch({
        type: ACTIONS.UPDATE_COLUMN_INFO,
        boardId,
        id,
        newData,
    });

    const updateColumnStyle = (boardId, id, newData) => dispatch({
        type: ACTIONS.UPDATE_COLUMN_STYLE,
        boardId,
        id,
        newData,
    });

    // Template helpers
    const addTemplateColumn = (boardId, index, templateColumn) => addColumn(boardId, index, { ...templateColumn, isTemplate: true });
    const updateTemplateColumnInfo = (boardId, id, newData) => {
        updateColumnInfo(boardId, id, newData);
        const mirror = boardId === "kanban" ? "scrum" : "kanban";
        updateColumnInfo(mirror, id, newData);
    };

    const updateTemplateColumnStyle = (boardId, id, newData) => {
        updateColumnStyle(boardId, id, newData);
        const mirror = boardId === "kanban" ? "scrum" : "kanban";
        updateColumnStyle(mirror, id, newData);
    };

    return {
        addColumn,
        removeColumn,
        updateColumnInfo,
        updateColumnStyle,
        addTemplateColumn,
        updateTemplateColumnInfo,
        updateTemplateColumnStyle,
    };
}
