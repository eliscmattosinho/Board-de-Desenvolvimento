import { useState, useRef, useEffect } from "react";
import { lockBodyScroll, unlockBodyScroll } from "../utils/modalUtils";

export function useBottomSheet({ isOpen, showHeader = true, onClose }) {
    const sheetRef = useRef(null);
    const startYRef = useRef(0);
    const lastYRef = useRef(0);
    const isDraggingRef = useRef(false);
    const dragOffsetRef = useRef(0);
    const currentHeightRef = useRef(0);
    const velocityRef = useRef(0);

    const [sheetHeight, setSheetHeight] = useState(0);
    const [maxSheetHeight, setMaxSheetHeight] = useState(0);
    const [animating, setAnimating] = useState("opening");
    const minHeight = 80;

    // Atualiza altura do modal
    useEffect(() => {
        if (!sheetRef.current) return;

        const bodyEl = sheetRef.current.querySelector(".bottom-sheet-body");
        if (!bodyEl) return;

        const updateHeight = () => {
            if (isDraggingRef.current) return;
            const newHeight = bodyEl.scrollHeight + (showHeader ? 60 : 40);
            setMaxSheetHeight(newHeight);
            setSheetHeight(newHeight);
            currentHeightRef.current = newHeight;
        };

        updateHeight();
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(bodyEl);

        return () => resizeObserver.disconnect();
    }, [showHeader]);

    // Trava/destrava scroll ao abrir/fechar
    useEffect(() => {
        if (isOpen) {
            lockBodyScroll();
            setAnimating("opening");
            const timer = setTimeout(() => setAnimating(null), 300);
            return () => {
                clearTimeout(timer);
                unlockBodyScroll();
            };
        } else {
            unlockBodyScroll();
        }
    }, [isOpen]);

    // Drag handlers
    const handleDragStart = (e) => {
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startYRef.current = clientY;
        lastYRef.current = clientY;
        velocityRef.current = 0;
        isDraggingRef.current = true;
        dragOffsetRef.current = 0;
        if (sheetRef.current) sheetRef.current.style.transition = "none";
    };

    const handleDragMove = (e) => {
        if (!isDraggingRef.current || !sheetRef.current) return;

        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const diff = lastYRef.current - clientY;
        lastYRef.current = clientY;
        dragOffsetRef.current += diff;

        let newHeight = currentHeightRef.current + dragOffsetRef.current;

        if (newHeight > maxSheetHeight) {
            const excess = newHeight - maxSheetHeight;
            newHeight = maxSheetHeight + excess / 6;
        }

        if (newHeight < minHeight) newHeight = minHeight;

        sheetRef.current.style.height = `${newHeight}px`;
    };

    const handleDragEnd = () => {
        if (!sheetRef.current) return;
        sheetRef.current.style.transition = "height 0.25s ease";

        const currentHeight = parseFloat(sheetRef.current.style.height);
        const viewportHeight = window.innerHeight;
        const halfScreen = viewportHeight * 0.5;

        if (currentHeight < halfScreen) {
            setAnimating("closing");
            setTimeout(() => onClose(), 250);
            return;
        }

        if (currentHeight > maxSheetHeight) {
            setSheetHeight(maxSheetHeight);
            requestAnimationFrame(() => {
                if (sheetRef.current)
                    sheetRef.current.style.height = `${maxSheetHeight}px`;
            });
        } else {
            setSheetHeight(currentHeight);
        }

        isDraggingRef.current = false;
        dragOffsetRef.current = 0;

        const bodyEl = sheetRef.current?.querySelector(".bottom-sheet-body");
        if (bodyEl) {
            const newHeight = bodyEl.scrollHeight + (showHeader ? 60 : 40);
            setMaxSheetHeight(newHeight);
            setSheetHeight(newHeight);
        }
    };

    return {
        sheetRef,
        sheetHeight,
        animating,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    };
}
