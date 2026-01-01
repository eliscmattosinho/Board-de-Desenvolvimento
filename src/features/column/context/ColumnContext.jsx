import React, { createContext, useContext, useReducer } from "react";
import { columnReducer } from "./columnReducer";
import { columnActions } from "./columnActions";
import { boardTemplates } from "@board/domain/boardTemplates";

const ColumnContext = createContext(null);

const initializeColumns = (templates) => {
  return Object.fromEntries(
    Object.entries(templates).map(([boardId, board]) => [
      boardId,
      board.columns.map((col) => ({
        ...col,
        isTemplate: true,
        isReadOnly: true,
        style: {
          bg:
            col.style?.bg ??
            (col.applyTo === "fundo" ? col.color : "transparent"),
          border:
            col.style?.border ??
            (col.applyTo === "borda" ? col.color : "transparent"),
          color:
            col.style?.color ??
            (col.applyTo === "borda" ? col.color : "#212121"),
        },
      })),
    ])
  );
};

export const ColumnProvider = ({ children }) => {
  const initialColumns = initializeColumns(boardTemplates);

  const [state, dispatch] = useReducer(columnReducer, {
    columns: initialColumns,
  });

  const actions = columnActions(dispatch);

  return (
    <ColumnContext.Provider
      value={{
        columns: state.columns,
        ...actions,
      }}
    >
      {children}
    </ColumnContext.Provider>
  );
};

export const useColumnsContext = () => {
  const ctx = useContext(ColumnContext);
  if (!ctx) {
    throw new Error("useColumnsContext must be used inside ColumnProvider");
  }
  return ctx;
};
