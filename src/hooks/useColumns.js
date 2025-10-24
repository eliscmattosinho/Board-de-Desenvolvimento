import { useState } from "react";

export default function useColumns(defaultKanban, defaultScrum) {
  const [columns, setColumns] = useState({
    kanban: defaultKanban || [],
    scrum: defaultScrum || [],
  });

  const addColumn = (view, index, columnData) => {
    setColumns((prev) => {
      const newColumn = {
        id: `col-${Date.now()}`,
        title: columnData?.title || "Nova Coluna",
        color: columnData?.color || "#02773aff",
        description: columnData?.description || "",
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

  const renameColumn = (view, id, newData) => {
    setColumns((prev) => {
      const updatedView = prev[view].map((col) =>
        col.id === id ? { ...col, ...newData } : col
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
