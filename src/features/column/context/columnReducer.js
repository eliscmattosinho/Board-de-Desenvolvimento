import { saveColumnsToStorage } from "@column/services/columnPersistence";

export const ACTIONS = {
  ADD_COLUMN: "ADD_COLUMN",
  REMOVE_COLUMN: "REMOVE_COLUMN",
  UPDATE_COLUMN_INFO: "UPDATE_COLUMN_INFO",
  UPDATE_COLUMN_STYLE: "UPDATE_COLUMN_STYLE",
};

function cloneAsOverride(col) {
  return {
    ...col,
    isTemplate: false,
    isReadOnly: false,
    _originTemplateId: col.id,
  };
}

export function columnReducer(state, action) {
  const { columns } = state;

  const updateAndSave = (nextCols) => {
    saveColumnsToStorage(nextCols);
    return { ...state, columns: nextCols };
  };

  const updateColumnInArray = (boardId, id, updater) =>
    (columns[boardId] || []).map((col) => {
      if (String(col.id) !== String(id)) return col;
      // Se for template, ele "nasce" como uma coluna customizada ao ser editado
      const target = col.isTemplate ? cloneAsOverride(col) : col;
      return updater(target);
    });

  switch (action.type) {
    case ACTIONS.ADD_COLUMN: {
      const { boardId, index = 0, columnData } = action;
      const newCol = {
        id: columnData.id || `col-${Date.now()}`,
        title: columnData.title || "Nova coluna",
        status: columnData.status || "todo",
        color: columnData.color || "#EFEFEF",
        applyTo: columnData.applyTo || "fundo",
        isTemplate: false,
        style: {
          bg:
            columnData.applyTo === "fundo"
              ? columnData.color || "#EFEFEF"
              : "transparent",
          border:
            columnData.applyTo === "borda"
              ? columnData.color || "#EFEFEF"
              : "transparent",
          color: "#212121",
        },
      };

      const newList = [...(columns[boardId] || [])];
      newList.splice(index, 0, newCol);
      return updateAndSave({ ...columns, [boardId]: newList });
    }

    case ACTIONS.UPDATE_COLUMN_INFO: {
      const { boardId, id, newData } = action;
      return updateAndSave({
        ...columns,
        [boardId]: updateColumnInArray(boardId, id, (col) => ({
          ...col,
          title: newData.title ?? col.title,
          status: newData.status ?? col.status,
        })),
      });
    }

    case ACTIONS.UPDATE_COLUMN_STYLE: {
      const { boardId, id, newData } = action;
      return updateAndSave({
        ...columns,
        [boardId]: updateColumnInArray(boardId, id, (col) => {
          const color = newData.color ?? col.color;
          const applyTo = newData.applyTo ?? col.applyTo;
          return {
            ...col,
            color,
            applyTo,
            style: {
              bg: applyTo === "fundo" ? color : "transparent",
              border: applyTo === "borda" ? color : "transparent",
              color: col.style?.color ?? "#212121",
            },
          };
        }),
      });
    }

    case ACTIONS.REMOVE_COLUMN: {
      const { boardId, id } = action;
      return updateAndSave({
        ...columns,
        [boardId]: (columns[boardId] || []).filter(
          (c) => String(c.id) !== String(id)
        ),
      });
    }

    default:
      return state;
  }
}
