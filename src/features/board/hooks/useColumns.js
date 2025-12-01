import { useState } from "react";

// @TODO criar context-provider

/**
 * @Hook useColumns
 *
 * Suporta:
 *  - Adição, remoção e renomeação de colunas
 *  - Cores aplicadas ao fundo ou à borda
 *  - Colunas neutras ao criar novas
 *  - Reset de estilos quando edita colunas de template
 */
export default function useColumns(defaultKanban = [], defaultScrum = []) {
  const [columns, setColumns] = useState({
    kanban: defaultKanban,
    scrum: defaultScrum
  });

  /**
   * Adiciona uma nova coluna limpa
   */
  const addColumn = (view, index, columnData) => {
    setColumns((prev) => {
      const cleanColor = columnData?.color || "#EFEFEF";
      const cleanApplyTo = columnData?.applyTo || "fundo";

      const newColumn = {
        id: `col-${Date.now()}`,
        title: columnData?.title?.trim() || "Nova coluna",
        description: columnData?.description?.trim() || "",
        color: cleanColor,
        applyTo: cleanApplyTo,
        className: `${view}-column new`,
        styleVars: {
          bg: cleanApplyTo === "fundo" ? cleanColor : "transparent",
          border: cleanApplyTo === "borda" ? cleanColor : "transparent"
        }
      };

      const updated = [
        ...prev[view].slice(0, index),
        newColumn,
        ...prev[view].slice(index)
      ];

      return { ...prev, [view]: updated };
    });
  };

  /**
   * Renomeia ou atualiza uma coluna
   */
  const renameColumn = (view, id, newData) => {
    setColumns((prev) => {
      const updated = prev[view].map((col) => {
        if (col.id !== id) return col;

        const nextApply = newData.applyTo ?? col.applyTo;
        const nextColor = newData.color ?? col.color;

        const isTemplateCol = !!col.style;
        const baseCol = isTemplateCol ? { ...col, style: undefined } : col;

        const styleVars =
          nextApply === "fundo"
            ? { bg: nextColor, border: "transparent" }
            : { bg: "transparent", border: nextColor };

        return {
          ...baseCol,
          title: newData.title ?? col.title,
          description: newData.description ?? col.description,
          color: nextColor,
          applyTo: nextApply,
          styleVars
        };
      });

      return { ...prev, [view]: updated };
    });
  };

  /**
   * Remove uma coluna de um board
   */
  const removeColumn = (view, id) => {
    setColumns((prev) => ({
      ...prev,
      [view]: prev[view].filter((col) => col.id !== id)
    }));
  };

  return [columns, addColumn, renameColumn, removeColumn];
}
