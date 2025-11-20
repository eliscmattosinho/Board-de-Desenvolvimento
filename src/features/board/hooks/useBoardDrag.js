import { useCallback } from "react";
import { columnIdToCanonicalStatus } from "@board/utils/boardUtils";

export function useBoardDrag(moveTask) {
    const allowDrop = useCallback((e) => e.preventDefault(), []);

    const handleDragStart = useCallback(
        (e, taskId) => e.dataTransfer.setData("text/plain", taskId),
        []
    );

    const handleDrop = useCallback(
        (e, columnId, targetTaskId = null) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData("text/plain");
            if (!taskId) return;

            const canonicalStatus = columnIdToCanonicalStatus(columnId);
            moveTask(taskId, canonicalStatus, targetTaskId);
        },
        [moveTask]
    );

    return { allowDrop, handleDragStart, handleDrop };
}
