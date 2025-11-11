import React, { useState, useEffect, useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "./Modal.css";
import "./Modal.mobile.css";

export default function Modal({
    title,
    children,
    onClose,
    showHeader = true,
    width = "350px",
    className = "",
    closeTooltip = "Fechar",
    isOpen = true,
}) {
    // @TODO mudar comportamento de crud em mobile 

    // Na próxima, só lib
    const [mobile, setMobile] = useState(window.innerWidth <= 480);
    const [animating, setAnimating] = useState("opening"); // "opening" | "closing" | null

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

    // Detecta se é mobile
    useEffect(() => {
        const handleResize = () => setMobile(window.innerWidth <= 480);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Inicializa altura e observa mudanças no conteúdo
    useEffect(() => {
        if (!mobile || !sheetRef.current) return;

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
    }, [mobile, showHeader]);

    // Bloqueia scroll do fundo
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

    // Fecha com animação
    const handleClose = () => {
        setAnimating("closing");
        setTimeout(() => onClose(), 250);
    };

    // Mantém altura atual em sync
    useEffect(() => {
        currentHeightRef.current = sheetHeight;
    }, [sheetHeight]);

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

        // Rebote elástico ao puxar pra cima
        if (newHeight > maxSheetHeight) {
            const excess = newHeight - maxSheetHeight;
            newHeight = maxSheetHeight + excess / 6;
        }

        // Impede fechamento total
        if (newHeight < minHeight) newHeight = minHeight;

        sheetRef.current.style.height = `${newHeight}px`;
    };

    const handleDragEnd = () => {
        if (!sheetRef.current) return;
        sheetRef.current.style.transition = "height 0.25s ease";

        const currentHeight = parseFloat(sheetRef.current.style.height);
        const viewportHeight = window.innerHeight;
        const halfScreen = viewportHeight * 0.5;

        // Fecha se o modal for arrastado até a metade da tela
        if (currentHeight < halfScreen) {
            handleClose();
            return;
        }

        // Rebote suave se puxou demais pra cima
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

        // Recalcula altura final
        const bodyEl = sheetRef.current?.querySelector(".bottom-sheet-body");
        if (bodyEl) {
            const newHeight = bodyEl.scrollHeight + (showHeader ? 60 : 40);
            setMaxSheetHeight(newHeight);
            setSheetHeight(newHeight);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={mobile ? "bottom-sheet" : "modal"}>
            {!mobile ? (
                <div className={`modal-wrapper ${animating === "closing" ? "closing" : ""}`}>
                    <div
                        className="modal-container"
                        style={{
                            width,
                            transition:
                                velocityRef.current === 0 ? "height 0.2s ease" : "none",
                        }}
                        ref={sheetRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {showHeader && (
                            <div className="modal-header-row">
                                {title && <h2 className="modal-title">{title}</h2>}
                            </div>
                        )}
                        <div className="modal-body">{children}</div>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            data-tooltip={closeTooltip}
                        >
                            <IoIosCloseCircleOutline size={25} />
                        </button>
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    );
}
