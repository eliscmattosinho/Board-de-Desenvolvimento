import { useMemo } from "react";
import { groupTasksByColumn } from "@board/utils/boardUtils";

export function useTasksByColumn({ columns, tasks, activeBoard }) {
  return useMemo(
    () =>
      groupTasksByColumn({
        columns,
        tasks,
        activeBoard,
      }),
    [columns, tasks, activeBoard]
  );
}
