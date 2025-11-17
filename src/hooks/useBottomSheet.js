import { useState, useRef, useEffect } from "react";
import { lockBodyScroll, unlockBodyScroll } from "@utils/modalUtils";

export function useBottomSheet({ isOpen, showHeader = true, onClose }) {
    const sheetRef = useRef(null);
    const startYRef = useRef(0);
    const lastYRef = useRef(0);
    const isDraggingRef = useRef(false);
    const dragOffsetRef = useRef(0);
    const currentHeightRef = useRef(0);

    const [sheetHeight, setSheetHeight] = useState(0);
    const [maxSheetHeight, setMaxSheetHeight] = useState(0);
    const [animating, setAnimating] = useState("opening");
    const minHeight = 80;

    // Função para calcular altura de forma robusta
    const calculateHeight = () => {
        if (!sheetRef.current || isDraggingRef.current) return;

        const container = sheetRef.current;
        let totalHeight = 0;

        Array.from(container.children).forEach((child) => {
            const style = window.getComputedStyle(child);
            const marginTop = parseFloat(style.marginTop) || 0;
            const marginBottom = parseFloat(style.marginBottom) || 0;
            totalHeight += child.offsetHeight + marginTop + marginBottom;
        });

        // Ajuste extra de 20px
        totalHeight += 40;

        setMaxSheetHeight(totalHeight);
        setSheetHeight(totalHeight);
        currentHeightRef.current = totalHeight;
    };

    // Atualiza altura do modal com ResizeObserver
    useEffect(() => {
        if (!sheetRef.current) return;

        calculateHeight(); // cálculo inicial

        const resizeObserver = new ResizeObserver(calculateHeight);
        resizeObserver.observe(sheetRef.current);
        Array.from(sheetRef.current.children).forEach((child) => resizeObserver.observe(child));

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

        isDraggingRef.current = false;
        sheetRef.current.style.transition = "height 0.25s ease";

        const currentHeight = parseFloat(sheetRef.current.style.height);
        const viewportHeight = window.innerHeight;
        const halfScreen = viewportHeight * 0.5;

        if (dragOffsetRef.current > 0) {
        // Rebote até o máximo permitido
            setSheetHeight(maxSheetHeight);
            requestAnimationFrame(() => {
                if (sheetRef.current)
                    sheetRef.current.style.height = `${maxSheetHeight}px`;
            });
            dragOffsetRef.current = 0;
            return;
        }

        if (currentHeight < halfScreen) {
            setAnimating("closing");
            setTimeout(() => onClose(), 250);
            dragOffsetRef.current = 0;
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

        dragOffsetRef.current = 0;
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
