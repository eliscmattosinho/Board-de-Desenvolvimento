import { useState, useEffect, useCallback } from "react";

/**
 * Hook para arrastar um painel flutuante (mouse + touch)
 * @param {object} panelRef - useRef para o painel
 * @param {object} anchorRef - useRef para o elemento que abre o painel
 */
export default function useDragFloatingPanel(panelRef, anchorRef) {
    const [position, setPosition] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // posicionamento inicial baseado no anchor
    useEffect(() => {
        const rect = anchorRef.current?.getBoundingClientRect();
        if (rect) {
            setPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            });
        }
    }, [anchorRef]);

    // Drag
    const startDrag = (clientX, clientY) => {
        setIsDragging(true);
        setDragOffset({
            x: clientX - position.left,
            y: clientY - position.top,
        });
        document.body.style.userSelect = "none";
    };

    const onMove = (clientX, clientY) => {
        const panel = panelRef.current;
        if (!panel) return;

        let newLeft = clientX - dragOffset.x;
        let newTop = clientY - dragOffset.y;

        const maxLeft = window.innerWidth - panel.offsetWidth;
        const maxTop = document.documentElement.scrollHeight - panel.offsetHeight;

        setPosition({
            left: Math.max(0, Math.min(newLeft, maxLeft)),
            top: Math.max(0, Math.min(newTop, maxTop)),
        });
    };

    // MOUSE
    const handleMouseDown = (e) => {
        startDrag(e.clientX, e.clientY);
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging) return;
            onMove(e.clientX, e.clientY);
        },
        [isDragging, dragOffset]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        document.body.style.userSelect = "";
    }, []);

    // TOUCH
    const handleTouchStart = (e) => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
    };

    const handleTouchMove = useCallback(
        (e) => {
            if (!isDragging) return;
            const t = e.touches[0];
            onMove(t.clientX, t.clientY);
        },
        [isDragging, dragOffset]
    );

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
        document.body.style.userSelect = "";
    }, []);

    // global listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            document.addEventListener("touchmove", handleTouchMove, { passive: false });
            document.addEventListener("touchend", handleTouchEnd);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    return {
        position,
        isDragging,
        handleMouseDown,
        handleTouchStart,
        setPosition,
    };
}
