export const ACTIONS = {
    ADD_COLUMN: "ADD_COLUMN",
    RENAME_COLUMN: "RENAME_COLUMN",
    REMOVE_COLUMN: "REMOVE_COLUMN",
};

export function columnReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_COLUMN: {
            const { view, index, columnData } = action;
            const cleanColor = columnData?.color || "#EFEFEF";
            const cleanApplyTo = columnData?.applyTo || "fundo";

            const newColumn = {
                id: `col-${Date.now()}`,
                title: columnData?.title?.trim() || "Nova coluna",
                description: columnData?.description?.trim() || "",
                style: {
                    bg: cleanApplyTo === "fundo" ? cleanColor : "transparent",
                    border: cleanApplyTo === "borda" ? cleanColor : "transparent",
                    color: cleanColor,
                },
                applyTo: cleanApplyTo,
                color: cleanColor,
                className: `${view}-column new`,
            };

            const updated = [
                ...(state.columns[view] || []).slice(0, index),
                newColumn,
                ...(state.columns[view] || []).slice(index),
            ];

            return { ...state, columns: { ...state.columns, [view]: updated } };
        }

        case ACTIONS.RENAME_COLUMN: {
            const { view, id, newData } = action;
            const updated = (state.columns[view] || []).map((col) => {
                if (col.id !== id) return col;

                const nextApply = newData.applyTo ?? col.applyTo;
                const nextColor = newData.color ?? col.color;

                let style = {};
                if (nextApply === "fundo") {
                    style = {
                        bg: nextColor,
                        border: "transparent",
                        color: nextColor,
                    };
                } else if (nextApply === "borda") {
                    style = {
                        bg: "transparent",
                        border: nextColor,
                        color: nextColor,
                    };
                }

                return {
                    ...col,
                    title: newData.title ?? col.title,
                    description: newData.description ?? col.description,
                    color: nextColor,
                    applyTo: nextApply,
                    style,
                };
            });

            return { ...state, columns: { ...state.columns, [view]: updated } };
        }

        case ACTIONS.REMOVE_COLUMN: {
            const { view, id } = action;
            const updated = (state.columns[view] || []).filter((col) => col.id !== id);
            return { ...state, columns: { ...state.columns, [view]: updated } };
        }

        default:
            return state;
    }
}
