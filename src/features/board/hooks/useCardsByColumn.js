import { useMemo } from "react";
import { groupCardsByColumn } from "@board/utils/boardUtils";

export function useCardsByColumn({ columns, cards, activeBoard }) {
  return useMemo(
    () =>
      groupCardsByColumn({
        columns,
        cards,
        activeBoard,
      }),
    [columns, cards, activeBoard]
  );
}
