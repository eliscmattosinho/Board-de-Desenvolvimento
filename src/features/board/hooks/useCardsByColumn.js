import { useMemo } from "react";
import { groupCardsByColumn } from "@board/utils/boardUtils";
import { useColumnsContext } from "@column/context/ColumnContext";

export function useCardsByColumn({ columns, cards, activeBoard }) {
  const { columns: allColumns } = useColumnsContext();

  return useMemo(
    () =>
      groupCardsByColumn({
        columns,
        cards,
        activeBoard,
        allColumns,
      }),
    [columns, cards, activeBoard, allColumns]
  );
}