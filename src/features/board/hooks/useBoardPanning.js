import { useRef, useCallback, useEffect } from "react";
import { useCancelClickOnHold } from "@/hooks/useCancelClickOnHold";

export function useBoardPanning({ containerId, holdDelay = 160 }) {
    const { markClickForCancel } = useCancelClickOnHold();

    const isPanning = useRef(false);
    const isDraggingCard = useRef(false);

    const startX = useRef(0);
    const lastX = useRef(0);
    const velocity = useRef(0);

    const rafRef = useRef(null);
    const holdTimeoutRef = useRef(null);

    const setDraggingCard = (value) => {
        isDraggingCard.current = value;
    };

    const isInteractive = (el) => {
        if (!el) return false;
        const tag = el.tagName.toLowerCase();
        return (
            tag === "button" ||
            tag === "input" ||
            tag === "textarea" ||
            el.closest("button, input, textarea, [role='button']") != null
        );
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
        const container = document.getElementById(containerId);
        if (container) container.classList.remove("panning");

        if (isPanning.current) startInertia();

        isPanning.current = false;
        clearTimeout(holdTimeoutRef.current);
    }, [startInertia]);

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

    /** MOUSE */
    const handleMouseDown = (e) => {
        if (isDraggingCard.current || isInteractive(e.target)) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        lastX.current = e.clientX;
        startX.current = e.clientX;
        velocity.current = 0;

        // Adiciona holdDelay para panning
        holdTimeoutRef.current = setTimeout(() => {
            isPanning.current = true;
            container.classList.add("panning");
            markClickForCancel();
        }, holdDelay);
    };

    const handleMouseMove = (e) => {
        if (!isPanning.current) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        velocity.current = dx;
        container.scrollLeft -= dx;
    };

    const handleMouseUpOrLeave = () => {
        clearTimeout(holdTimeoutRef.current);
        stopPanning();
    };

    /** TOUCH */
    const handleTouchStart = (e) => {
        if (isDraggingCard.current) return;

        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (isInteractive(el)) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        lastX.current = touch.clientX;
        startX.current = touch.clientX;
        velocity.current = 0;
        isPanning.current = false;
    };

    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const container = document.getElementById(containerId);
        if (!container) return;

        const dx = touch.clientX - lastX.current;
        lastX.current = touch.clientX;
        velocity.current = dx;

        if (!isPanning.current && Math.abs(touch.clientX - startX.current) > 5) {
            isPanning.current = true;
            container.classList.add("panning");
            markClickForCancel();
        }

        if (isPanning.current) container.scrollLeft -= dx;
    };

    const handleTouchEnd = () => stopPanning();

    return {
        bind: {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUpOrLeave,
            onMouseLeave: handleMouseUpOrLeave,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            style: {
                cursor: isPanning.current ? "grabbing" : "grab",
            },
        },
        setDraggingCard,
    };
}
