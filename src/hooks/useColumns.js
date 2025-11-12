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

  /**
   * Adiciona uma nova coluna com estilos neutros (limpos)
   */
  const addColumn = (view, index, columnData) => {
    setColumns((prev) => {
      // Limpa estilos antigos e define valores padrão neutros
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
          border: cleanApplyTo === "borda" ? cleanColor : "transparent",
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

  /**
   * Renomeia ou atualiza uma coluna existente
   * (também reseta estilos antigos antes de aplicar novos)
   */
  const renameColumn = (view, id, newData) => {
    setColumns((prev) => {
      const updatedView = prev[view].map((col) => {
        if (col.id !== id) return col;

        const nextApply = newData.applyTo ?? col.applyTo;
        const nextColor = newData.color ?? col.color;

        // Sempre limpa estilos antigos de template (se existir `style`)
        const isTemplateCol = !!col.style;
        const cleanedCol = isTemplateCol
          ? { ...col, style: undefined } // remove o estilo herdado
          : col;

        // Cria novos estilos baseados na escolha do usuário
        const nextStyleVars =
          nextApply === "fundo"
            ? { bg: nextColor, border: "transparent" }
            : { bg: "transparent", border: nextColor };

        return {
          ...cleanedCol,
          title: newData.title ?? col.title,
          description: newData.description ?? col.description,
          color: nextColor,
          applyTo: nextApply,
          styleVars: nextStyleVars,
        };
      });

      return { ...prev, [view]: updatedView };
    });
  };

  /**
   * Remove uma coluna de um board
   */
  const removeColumn = (view, id) => {
    setColumns((prev) => {
      const updatedView = prev[view].filter((col) => col.id !== id);
      return { ...prev, [view]: updatedView };
    });
  };

  return [columns, addColumn, renameColumn, removeColumn];
}
