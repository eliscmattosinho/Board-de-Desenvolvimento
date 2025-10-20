import { useState } from "react";

export default function useColumns(defaultKanban, defaultScrum) {
  // Estado inicial com colunas padrão
  const [columns, setColumns] = useState({
    kanban: defaultKanban || [],
    scrum: defaultScrum || [],
  });

  // Adicionar nova coluna
  const addColumn = (view, index) => {
    setColumns((prev) => {
      const newColumn = {
        id: `col-${Date.now()}`,
        title: "Nova Coluna",
        className: `${view}-column new`,
      };

      const updatedView = [
        ...prev[view].slice(0, index),
        newColumn,
        ...prev[view].slice(index),
      ];

      return { ...prev, [view]: updatedView };
    });
  };

  // Renomear coluna
  const renameColumn = (view, id, newTitle) => {
    setColumns((prev) => {
      const updatedView = prev[view].map((col) =>
        col.id === id ? { ...col, title: newTitle } : col
      );
      return { ...prev, [view]: updatedView };
    });
  };

  // Remover coluna
  const removeColumn = (view, id) => {
    setColumns((prev) => {
      const updatedView = prev[view].filter((col) => col.id !== id);
      return { ...prev, [view]: updatedView };
    });
  };

  return [columns, addColumn, renameColumn, removeColumn];
}
