import { ACTIONS } from "./columnReducer";

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

    return { addColumn, renameColumn, removeColumn };
}
