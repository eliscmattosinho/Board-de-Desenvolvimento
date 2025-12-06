import { useCallback } from "react";
import { getTaskColumns } from "@board/components/templates/templateMirror";

export function useBoardDrag(moveTask) {
    const allowDrop = useCallback((e) => e.preventDefault(), []);

    const handleDragStart = useCallback(
        (e, taskId) => e.dataTransfer.setData("text/plain", taskId),
        []
    );

    const handleDrop = useCallback(
        (e, columnId, targetTaskId = null, position = null) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData("text/plain");
            if (!taskId) return;

            const title = e?.target?.dataset?.status;
            const { columnId: canonicalColumnId } = title
                ? getTaskColumns({ status: title })
                : { columnId: columnId };

            moveTask(taskId, { columnId: canonicalColumnId, targetTaskId, position });
        },
        [moveTask]
    );

    return { allowDrop, handleDragStart, handleDrop };
}
