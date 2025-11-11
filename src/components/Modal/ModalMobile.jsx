import React, { useState, useEffect, useRef } from "react";

export default function ModalMobile({
    title,
    children,
    onClose,
    showHeader = true,
    className = "",
    closeTooltip = "Fechar",
    isOpen = true,
}) {

    // @TODO mudar comportamento de crud em mobile 

    const [animating, setAnimating] = useState("opening");
    const sheetRef = useRef(null);
    const startYRef = useRef(0);
    const lastYRef = useRef(0);
    const velocityRef = useRef(0);
    const isDraggingRef = useRef(false);
    const currentHeightRef = useRef(0);
    const dragOffsetRef = useRef(0);
    const [sheetHeight, setSheetHeight] = useState(0);
    const [maxSheetHeight, setMaxSheetHeight] = useState(0);
    const minHeight = 80;

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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            setAnimating("opening");
            const timer = setTimeout(() => setAnimating(null), 300);
            return () => clearTimeout(timer);
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [isOpen]);

    const handleClose = () => {
        setAnimating("closing");
        setTimeout(() => onClose(), 250);
    };

    useEffect(() => {
        currentHeightRef.current = sheetHeight;
    }, [sheetHeight]);

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
            handleClose();
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

    if (!isOpen) return null;

    return (
        <div className="bottom-sheet">
            <div
                className={`bottom-sheet-container ${animating || ""}`}
                style={{
                    height: `${sheetHeight}px`,
                    transition: isDraggingRef.current ? "none" : "height 0.25s ease",
                }}
                ref={sheetRef}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="bottom-sheet-handle"
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onMouseMove={handleDragMove}
                    onTouchMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchEnd={handleDragEnd}
                />
                {showHeader && (
                    <div className="bottom-sheet-header">
                        {title && <h2 className="modal-title">{title}</h2>}
                    </div>
                )}
                <div className="bottom-sheet-body">{children}</div>
            </div>
        </div>
    );
}
