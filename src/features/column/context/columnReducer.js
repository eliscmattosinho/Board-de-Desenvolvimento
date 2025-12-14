import { getMirrorLocation } from "@board/utils/boardSyncUtils";
import {
    createStyle,
    generateColumnId,
    mirrorBoard,
} from "@column/utils/columnUtils";

export const ACTIONS = {
    ADD_COLUMN: "ADD_COLUMN",
    REMOVE_COLUMN: "REMOVE_COLUMN",
    UPDATE_COLUMN_INFO: "UPDATE_COLUMN_INFO",
    UPDATE_COLUMN_STYLE: "UPDATE_COLUMN_STYLE",
};

export function columnReducer(state, action) {
    const updateColumnArray = (columns, boardId, id, updater) =>
        (columns[boardId] || []).map((col) => (col.id !== id ? col : updater(col)));

    const updateMirrorColumn = (columns, boardId, id, updater) => {
        const mirror = mirrorBoard(boardId);
        const mirrorId = getMirrorLocation(boardId, id);
        if (!mirrorId) return columns;

        const updatedMirrorCols = updateColumnArray(
            columns,
            mirror,
            mirrorId,
            updater
        );
        return { ...columns, [mirror]: updatedMirrorCols };
    };

    switch (action.type) {
        case ACTIONS.ADD_COLUMN: {
            const { boardId, index = 0, columnData } = action;
            const isTemplate = Boolean(columnData?.isTemplate);
            const newId = generateColumnId(isTemplate, columnData.id);
            const color = columnData?.color || "#EFEFEF";
            const applyTo = columnData?.applyTo || "fundo";

            const newColumn = {
                id: newId,
                title: columnData?.title?.trim() || "Nova coluna",
                description: columnData?.description?.trim() || "",
                style: createStyle(applyTo, color),
                color,
                applyTo,
                className: `${boardId}-column ${isTemplate ? "template" : "new"}`,
                isTemplate,
            };

            const updatedColumns = {
                ...state.columns,
                [boardId]: [...(state.columns[boardId] || [])],
            };
            const safeIndex = Math.max(
                0,
                Math.min(index, updatedColumns[boardId].length)
            );
            updatedColumns[boardId].splice(safeIndex, 0, newColumn);

            if (isTemplate) {
                const mirror = mirrorBoard(boardId);
                const mirrorId = getMirrorLocation(boardId, newId);
                if (mirrorId) {
                    const mirroredColumn = {
                        ...newColumn,
                        id: mirrorId,
                        className: `${mirror}-column template`,
                    };
                    updatedColumns[mirror] = [...(updatedColumns[mirror] || [])];
                    updatedColumns[mirror].splice(safeIndex, 0, mirroredColumn);
                }
            }

            return { ...state, columns: updatedColumns };
        }

        case ACTIONS.UPDATE_COLUMN_INFO: {
            const { boardId, id, newData } = action;
            let columns = {
                ...state.columns,
                [boardId]: updateColumnArray(state.columns, boardId, id, (col) => ({
                    ...col,
                    title: newData.title ?? col.title,
                    description: newData.description ?? col.description,
                })),
            };

            const sourceCol = (state.columns[boardId] || []).find((c) => c.id === id);
            if (sourceCol?.isTemplate)
                columns = updateMirrorColumn(columns, boardId, id, (col) => ({
                    ...col,
                    title: newData.title ?? col.title,
                    description: newData.description ?? col.description,
                }));

            return { ...state, columns };
        }

        case ACTIONS.UPDATE_COLUMN_STYLE: {
            const { boardId, id, newData } = action;
            let columns = {
                ...state.columns,
                [boardId]: updateColumnArray(state.columns, boardId, id, (col) => {
                    const nextApply = newData.applyTo ?? col.applyTo;
                    const nextColor = newData.color ?? col.color;
                    return {
                        ...col,
                        applyTo: nextApply,
                        color: nextColor,
                        style: createStyle(nextApply, nextColor),
                    };
                }),
            };

            const sourceCol = (state.columns[boardId] || []).find((c) => c.id === id);
            if (sourceCol?.isTemplate)
                columns = updateMirrorColumn(columns, boardId, id, (col) => {
                    const nextApply = newData.applyTo ?? col.applyTo;
                    const nextColor = newData.color ?? col.color;
                    return {
                        ...col,
                        applyTo: nextApply,
                        color: nextColor,
                        style: createStyle(nextApply, nextColor),
                    };
                });

            return { ...state, columns };
        }

        case ACTIONS.REMOVE_COLUMN: {
            const { boardId, id } = action;
            const sourceCol = (state.columns[boardId] || []).find((c) => c.id === id);

            let columns = {
                ...state.columns,
                [boardId]: (state.columns[boardId] || []).filter(
                    (col) => col.id !== id
                ),
            };

            if (sourceCol?.isTemplate) {
                const mirror = mirrorBoard(boardId);
                const mirrorId = getMirrorLocation(boardId, id);
                if (mirrorId)
                    columns[mirror] = (columns[mirror] || []).filter(
                        (c) => c.id !== mirrorId
                    );
            }

            return { ...state, columns };
        }

        default:
            return state;
    }
}
