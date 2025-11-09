import { useState } from "react";

/**
 * @Hook useColumns
 * 
 * Gerencia o estado das colunas de cada board (Kanban e Scrum).
 * Suporta:
 *  - Adição, remoção e renomeação de colunas
 *  - Cores aplicadas ao fundo ou à borda
 *  - Total compatibilidade com o espelhamento 1:1
 */

export default function useColumns(defaultKanban, defaultScrum) {
  const [columns, setColumns] = useState({
    kanban: defaultKanban || [],
    scrum: defaultScrum || [],
  });

  const addColumn = (view, index, columnData) => {
    setColumns((prev) => {
      const newColumn = {
        id: `col-${Date.now()}`,
        title: columnData?.title || "Nova coluna",
        color: columnData?.color || "#EFEFEF",
        applyTo: columnData?.applyTo || "fundo",
        description: columnData?.description || "",
        className: `${view}-column new`,
        styleVars: {
          bg:
            columnData?.applyTo === "fundo"
              ? columnData?.color || "#EFEFEF"
              : "transparent",
          border:
            columnData?.applyTo === "borda"
              ? columnData?.color || "#CCCCCC"
              : "transparent",
        },
      };

      const updatedView = [
        ...prev[view].slice(0, index),
        newColumn,
        ...prev[view].slice(index),
      ];

      return { ...prev, [view]: updatedView };
    });
  };

  const renameColumn = (view, id, newData) => {
    setColumns((prev) => {
      const updatedView = prev[view].map((col) =>
        col.id === id
          ? {
            ...col,
            title: newData.title ?? col.title,
            description: newData.description ?? col.description,
            color: newData.color ?? col.color,
            applyTo: newData.applyTo ?? col.applyTo,
            styleVars: {
              bg:
                (newData.applyTo ?? col.applyTo) === "fundo"
                  ? newData.color ?? col.color
                  : col.styleVars?.bg ?? "transparent",
              border:
                (newData.applyTo ?? col.applyTo) === "borda"
                  ? newData.color ?? col.color
                  : col.styleVars?.border ?? "transparent",
            },
          }
          : col
      );
      return { ...prev, [view]: updatedView };
    });
  };

  const removeColumn = (view, id) => {
    setColumns((prev) => {
      const updatedView = prev[view].filter((col) => col.id !== id);
      return { ...prev, [view]: updatedView };
    });
  };

  return [columns, addColumn, renameColumn, removeColumn];
}
