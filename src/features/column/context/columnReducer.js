import { getMirrorColumnId } from "@board/components/templates/templateMirror";
import { getContrastColor } from "@column/utils/colorUtils";

export const ACTIONS = {
    ADD_COLUMN: "ADD_COLUMN",
    REMOVE_COLUMN: "REMOVE_COLUMN",
    UPDATE_COLUMN_INFO: "UPDATE_COLUMN_INFO",
    UPDATE_COLUMN_STYLE: "UPDATE_COLUMN_STYLE",
};

export function columnReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_COLUMN: {
            const { view, index = 0, columnData } = action;

            const isTemplate = columnData?.isTemplate || false;
            const newColumnId = isTemplate ? columnData.id : `custom-${Date.now()}`;
            const color = columnData?.color || "#EFEFEF";
            const applyTo = columnData?.applyTo || "fundo";

            const style =
                applyTo === "fundo"
                    ? { bg: color, border: "transparent", color: getContrastColor(color) }
                    : { bg: "transparent", border: color, color };

            const newColumn = {
                id: newColumnId,
                title: columnData?.title?.trim() || "Nova coluna",
                description: columnData?.description?.trim() || "",
                style,
                color,
                applyTo,
                className: `${view}-column ${isTemplate ? "template" : "new"}`,
                isTemplate,
            };
            const updatedViewColumns = [...(state.columns[view] || [])];
            const safeIndex = Math.max(0, Math.min(index, updatedViewColumns.length));
            updatedViewColumns.splice(safeIndex, 0, newColumn);
            const newColumns = { ...state.columns, [view]: updatedViewColumns };
            
            // Espelhamento de colunas em templates
            if (isTemplate) {
                const mirrorView = view === "kanban" ? "scrum" : "kanban";
                const mirrorId = getMirrorColumnId(view, newColumn.id);

                if (mirrorId) {
                    const mirroredColumn = {
                        ...newColumn,
                        id: mirrorId,
                        className: `${mirrorView}-column template`,
                    };

                    const mirrorCols = [...(newColumns[mirrorView] || [])];
                    const mirrorIndex = Math.min(safeIndex, mirrorCols.length);
                    mirrorCols.splice(mirrorIndex, 0, mirroredColumn);
                    newColumns[mirrorView] = mirrorCols;
                }
            }

            return { ...state, columns: newColumns };
        }

        case ACTIONS.UPDATE_COLUMN_INFO: {
            const { view, id, newData } = action;

            const updatedViewColumns = (state.columns[view] || []).map((col) =>
                col.id !== id
                    ? col
                    : { ...col, title: newData.title ?? col.title, description: newData.description ?? col.description }
            );

            const newColumns = { ...state.columns, [view]: updatedViewColumns };
            const sourceCol = (state.columns[view] || []).find(c => c.id === id);
            if (sourceCol?.isTemplate) {
                const mirrorView = view === "kanban" ? "scrum" : "kanban";
                const mirrorId = getMirrorColumnId(view, id);
                if (mirrorId) {
                    const updatedMirror = (newColumns[mirrorView] || []).map(col =>
                        col.id !== mirrorId ? col : { ...col, title: newData.title ?? col.title, description: newData.description ?? col.description }
                    );
                    newColumns[mirrorView] = updatedMirror;
                }
            }
            return { ...state, columns: newColumns };
        }

        case ACTIONS.UPDATE_COLUMN_STYLE: {
            const { view, id, newData } = action;

            const updatedViewColumns = (state.columns[view] || []).map((col) => {
                if (col.id !== id) return col;

                const nextApply = newData.applyTo ?? col.applyTo;
                const nextColor = newData.color ?? col.color;

                const style =
                    nextApply === "fundo"
                        ? { bg: nextColor, border: "transparent", color: getContrastColor(nextColor) }
                        : { bg: "transparent", border: nextColor, color: nextColor };

                return { ...col, color: nextColor, applyTo: nextApply, style };
            });

            const newColumns = { ...state.columns, [view]: updatedViewColumns };
            const sourceCol = (state.columns[view] || []).find(c => c.id === id);
            if (sourceCol?.isTemplate) {
                const mirrorView = view === "kanban" ? "scrum" : "kanban";
                const mirrorId = getMirrorColumnId(view, id);
                if (mirrorId) {
                    const updatedMirror = (newColumns[mirrorView] || []).map(col => {
                        if (col.id !== mirrorId) return col;
                        const nextApply = newData.applyTo ?? col.applyTo;
                        const nextColor = newData.color ?? col.color;
                        const style =
                            nextApply === "fundo"
                                ? { bg: nextColor, border: "transparent", color: getContrastColor(nextColor) }
                                : { bg: "transparent", border: nextColor, color: nextColor };
                        return { ...col, color: nextColor, applyTo: nextApply, style };
                    });
                    newColumns[mirrorView] = updatedMirror;
                }
            }
            return { ...state, columns: newColumns };
        }

        case ACTIONS.REMOVE_COLUMN: {
            const { view, id } = action;
            const updatedViewColumns = (state.columns[view] || []).filter((col) => col.id !== id);
            const newColumns = { ...state.columns, [view]: updatedViewColumns };
            const sourceCol = (state.columns[view] || []).find(c => c.id === id);
            if (sourceCol?.isTemplate) {
                const mirrorView = view === "kanban" ? "scrum" : "kanban";
                const mirrorId = getMirrorColumnId(view, id);
                if (mirrorId) {
                    newColumns[mirrorView] = (newColumns[mirrorView] || []).filter(c => c.id !== mirrorId);
                }
            }
            return { ...state, columns: newColumns };
        }

        default:
            return state;
    }
}
