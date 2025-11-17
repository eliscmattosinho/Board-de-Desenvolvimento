import { useRef, useCallback, useEffect } from "react";
import { useCancelClickOnHold } from "@/hooks/useCancelClickOnHold";

export function useBoardPanning({ containerId, holdDelay = 160 }) {
    const { markClickForCancel } = useCancelClickOnHold();

    const isPanning = useRef(false);
    const holdTimer = useRef(null);
    const isTouching = useRef(false);
    const isDraggingCard = useRef(false);

    const startX = useRef(0);
    const lastX = useRef(0);
    const velocity = useRef(0);

    const rafRef = useRef(null);

    const setDraggingCard = (value) => {
        isDraggingCard.current = value;
    };

    const startInertia = useCallback(() => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const friction = 0.92;

        const step = () => {
            velocity.current *= friction;

            if (Math.abs(velocity.current) < 0.1) {
                cancelAnimationFrame(rafRef.current);
                return;
            }

            container.scrollLeft -= velocity.current;
            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
    }, [containerId]);

    const stopPanning = useCallback(() => {
        clearTimeout(holdTimer.current);

        const container = document.getElementById(containerId);
        if (container) container.classList.remove("panning");

        if (isPanning.current) startInertia();

        isPanning.current = false;
        isTouching.current = false;
    }, [containerId, startInertia]);

    useEffect(() => {
        const handleGlobalDragEnd = () => {
            isDraggingCard.current = false;
            stopPanning();
        };

        window.addEventListener("dragend", handleGlobalDragEnd);
        window.addEventListener("drop", handleGlobalDragEnd);

        return () => {
            window.removeEventListener("dragend", handleGlobalDragEnd);
            window.removeEventListener("drop", handleGlobalDragEnd);
        };
    }, [stopPanning]);

    /** MOUSE DOWN */
    const handleMouseDown = (e) => {
        if (isDraggingCard.current) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        lastX.current = e.clientX;
        startX.current = e.clientX;
        velocity.current = 0;

        holdTimer.current = setTimeout(() => {
            isPanning.current = true;
            container.classList.add("panning");
            markClickForCancel();
        }, holdDelay);
    };

    /** MOUSE MOVE */
    const handleMouseMove = (e) => {
        if (!isPanning.current) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;

        velocity.current = dx;
        container.scrollLeft -= dx;
    };

    /** TOUCH START */
    const handleTouchStart = (e) => {
        if (isDraggingCard.current) return;

        const touch = e.touches[0];
        const container = document.getElementById(containerId);
        if (!container) return;

        isTouching.current = true;

        lastX.current = touch.clientX;
        startX.current = touch.clientX;
        velocity.current = 0;

        // Não ativar pan imediatamente
        holdTimer.current = setTimeout(() => {
            isPanning.current = true;
            container.classList.add("panning");
            markClickForCancel(); // só cancela click se realmente panning
        }, holdDelay);
    };

    /** TOUCH MOVE */
    const handleTouchMove = (e) => {
        if (!isTouching.current) return;

        const touch = e.touches[0];
        const container = document.getElementById(containerId);
        if (!container) return;

        const dx = touch.clientX - lastX.current;
        lastX.current = touch.clientX;
        velocity.current = dx;

        // Ativar panning se o movimento for sgnificativo
        if (!isPanning.current && Math.abs(touch.clientX - startX.current) > 5) {
            isPanning.current = true;
            container.classList.add("panning");
            markClickForCancel();
        }

        if (isPanning.current) {
            container.scrollLeft -= dx;
        }
    };

    /** TOUCH END */
    const handleTouchEnd = () => {
        stopPanning();
    };

    /** Cleanup pan ao sair da área */
    const handleMouseLeave = () => stopPanning();

    const bind = {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: stopPanning,
        onMouseLeave: handleMouseLeave,

        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,

        style: {
            cursor: isPanning.current ? "grabbing" : "grab",
        },
    };

    return {
        bind,
        setDraggingCard,
    };
}
