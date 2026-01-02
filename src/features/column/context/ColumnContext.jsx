import React, { createContext, useContext, useReducer, useMemo } from "react";
import { columnReducer } from "./columnReducer";
import { columnActions } from "./columnActions";
import { boardTemplates } from "@board/domain/boardTemplates";
import { loadColumnsFromStorage } from "@column/services/columnPersistence";

const ColumnContext = createContext(null);

const initializeColumns = () => {
  const savedColumns = loadColumnsFromStorage();
  if (savedColumns) return savedColumns;

  return Object.fromEntries(
    Object.entries(boardTemplates).map(([boardId, board]) => [
      boardId,
      board.columns.map((col) => ({
        ...col,
        isTemplate: true,
        isReadOnly: true,
        style: col.style || { bg: "#EFEFEF", color: "#212121" },
      })),
    ])
  );
};

export const ColumnProvider = ({ children }) => {
  const [state, dispatch] = useReducer(columnReducer, {
    columns: initializeColumns(),
  });

  // Memoiza as ações para que o BoardContext não mude a cada render
  const actions = useMemo(() => columnActions(dispatch), [dispatch]);

  const value = useMemo(
    () => ({
      columns: state.columns,
      ...actions,
    }),
    [state.columns, actions]
  );

  return (
    <ColumnContext.Provider value={value}>{children}</ColumnContext.Provider>
  );
};

export const useColumnsContext = () => {
  const ctx = useContext(ColumnContext);
  if (!ctx) {
    throw new Error("useColumnsContext must be used inside ColumnProvider");
  }
  return ctx;
};
