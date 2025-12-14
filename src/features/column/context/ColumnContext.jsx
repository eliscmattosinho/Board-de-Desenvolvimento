import React, { createContext, useContext, useReducer } from "react";
import { columnReducer } from "./columnReducer";
import { columnActions } from "./columnActions";
import { boardTemplates } from "@board/components/templates/boardTemplates";

const ColumnContext = createContext(null);

const initializeColumns = (templates) => {
    return Object.fromEntries(
        Object.entries(templates).map(([boardId, cols]) => [
            boardId,
            cols.map(col => ({
                ...col,
                style: { ...col.style },
                isTemplate: true,
            })),
        ])
    );
};

export const ColumnProvider = ({ children }) => {
    const initialColumns = initializeColumns(boardTemplates);
    const [state, dispatch] = useReducer(columnReducer, { columns: initialColumns });
    const actions = columnActions(dispatch);

    return (
        <ColumnContext.Provider value={{ columns: state.columns, ...actions }}>
            {children}
        </ColumnContext.Provider>
    );
};

export const useColumnsContext = () => {
    const ctx = useContext(ColumnContext);
    if (!ctx) throw new Error("useColumnsContext must be used inside ColumnProvider");
    return ctx;
};
