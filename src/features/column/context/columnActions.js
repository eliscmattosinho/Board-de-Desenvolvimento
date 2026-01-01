import { ACTIONS } from "./columnReducer";

export function columnActions(dispatch) {
  const addColumn = (boardId, index, columnData) =>
    dispatch({ type: ACTIONS.ADD_COLUMN, boardId, index, columnData });

  const removeColumn = (boardId, id) =>
    dispatch({ type: ACTIONS.REMOVE_COLUMN, boardId, id });

  const updateColumnInfo = (boardId, id, newData) =>
    dispatch({ type: ACTIONS.UPDATE_COLUMN_INFO, boardId, id, newData });

  const updateColumnStyle = (boardId, id, newData) =>
    dispatch({ type: ACTIONS.UPDATE_COLUMN_STYLE, boardId, id, newData });

  return {
    addColumn,
    removeColumn,
    updateColumnInfo,
    updateColumnStyle,
  };
}
