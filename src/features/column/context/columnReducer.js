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

  const updateColumnArray = (boardId, id, updater) =>
    (columns[boardId] || []).map((col) => {
      if (String(col.id) !== String(id)) return col;

      const target = col.isTemplate ? cloneAsOverride(col) : col;
      return updater(target);
    });

  switch (action.type) {
    case ACTIONS.ADD_COLUMN: {
      const { boardId, index = 0, columnData } = action;

      const newColumn = {
        id: String(columnData.id),
        title: columnData.title || "Nova coluna",
        color: columnData.color || "#EFEFEF",
        applyTo: columnData.applyTo || "fundo",
        isTemplate: false,
        isReadOnly: false,
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

      const list = [...(columns[boardId] || [])];
      list.splice(index, 0, newColumn);

      return {
        ...state,
        columns: {
          ...columns,
          [boardId]: list,
        },
      };
    }

    case ACTIONS.UPDATE_COLUMN_INFO: {
      const { boardId, id, newData } = action;

      return {
        ...state,
        columns: {
          ...columns,
          [boardId]: updateColumnArray(boardId, id, (col) => ({
            ...col,
            title: newData.title ?? col.title,
          })),
        },
      };
    }

    case ACTIONS.UPDATE_COLUMN_STYLE: {
      const { boardId, id, newData } = action;

      return {
        ...state,
        columns: {
          ...columns,
          [boardId]: updateColumnArray(boardId, id, (col) => {
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
        },
      };
    }

    case ACTIONS.REMOVE_COLUMN: {
      const { boardId, id } = action;

      return {
        ...state,
        columns: {
          ...columns,
          [boardId]: (columns[boardId] || []).filter(
            (col) => String(col.id) !== String(id)
          ),
        },
      };
    }

    default:
      return state;
  }
}
