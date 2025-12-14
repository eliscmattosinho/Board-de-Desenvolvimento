import { useCallback } from "react";

/**
 * Hook responsável exclusivamente por:
 * - habilitar drop
 * - iniciar drag
 * - montar payload explícito para MOVE_TASK
 *
 * Regras:
 * - Drag SEMPRE informa board e coluna de destino (view atual)
 */
export function useBoardDrag({
    moveTask,
    activeBoard,
}) {
    /**
     * Permite drop
     */
    const allowDrop = useCallback((e) => {
        e.preventDefault();
    }, []);

    /**
     * Inicia o drag
     * Armazena apenas o taskId
     */
    const handleDragStart = useCallback((e, taskId) => {
        if (!taskId) return;

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(taskId));
    }, []);

    /**
     * Drop handler
     */
    const handleDrop = useCallback(
        (e, columnId, targetTaskId = null, position = null) => {
            e.preventDefault();

            const taskId = e.dataTransfer.getData("text/plain");
            if (!taskId || !columnId) return;

            moveTask(taskId, {
                boardId: activeBoard,
                columnId,
                targetTaskId,
                position,
            });
        },
        [moveTask, activeBoard]
    );

    return {
        allowDrop,
        handleDragStart,
        handleDrop,
    };
}
