import React, { createContext, useContext, useReducer } from "react";
import { columnReducer, ACTIONS } from "./columnReducer";
import { columnActions } from "./columnActions";
import { boardTemplates, getMirrorColumnId } from "@board/components/templates/templateMirror";

const ColumnContext = createContext(null);

export const ColumnProvider = ({ children }) => {
    const initialColumns = {
        kanban: boardTemplates.kanban.map(col => ({ ...col, style: { ...col.style }, isTemplate: true })),
        scrum: boardTemplates.scrum.map(col => ({ ...col, style: { ...col.style }, isTemplate: true })),
    };

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
