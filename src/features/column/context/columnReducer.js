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
            const { view, index, columnData } = action;

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
            updatedViewColumns.splice(index, 0, newColumn);

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
                    newColumns[mirrorView] = [...(newColumns[mirrorView] || []), mirroredColumn];
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

            return { ...state, columns: { ...state.columns, [view]: updatedViewColumns } };
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

            return { ...state, columns: { ...state.columns, [view]: updatedViewColumns } };
        }

        case ACTIONS.REMOVE_COLUMN: {
            const { view, id } = action;
            const updatedViewColumns = (state.columns[view] || []).filter((col) => col.id !== id);
            return { ...state, columns: { ...state.columns, [view]: updatedViewColumns } };
        }

        default:
            return state;
    }
}
