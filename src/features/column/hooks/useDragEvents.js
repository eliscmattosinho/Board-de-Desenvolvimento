import { useCallback } from 'react';

export const useDragEvents = (taskId, onDragStart, onDrop, onDragOver, onDragLeave) => {
    const handleDragStart = useCallback(
        (e) => {
            e.stopPropagation();
            onDragStart?.(e, taskId);

            const dragImage = e.currentTarget.cloneNode(true);
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            dragImage.style.left = '-1000px';
            dragImage.style.width = `${e.currentTarget.offsetWidth}px`;
            document.body.appendChild(dragImage);

            e.dataTransfer.setDragImage(dragImage, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            e.dataTransfer.effectAllowed = 'move';

            setTimeout(() => {
                document.body.removeChild(dragImage);
            }, 0);
        },
        [taskId, onDragStart]
    );

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop?.(e);
    }, [onDrop]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver?.(e);
    }, [onDragOver]);

    const handleDragLeave = useCallback((e) => {
        e.stopPropagation();
        onDragLeave?.(e);
    }, [onDragLeave]);

    return { handleDragStart, handleDrop, handleDragOver, handleDragLeave };
};
