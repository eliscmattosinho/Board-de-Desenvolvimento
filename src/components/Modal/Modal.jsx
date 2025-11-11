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
    // @TODO responsive height content with modal content change (switch between cardview and edt) quando aumenta e se volta para um menor, ele não diminui

    const [closing, setClosing] = useState(false);
    const [mobile, setMobile] = useState(window.innerWidth <= 480);

    const sheetRef = useRef(null);
    const startYRef = useRef(0);
    const lastYRef = useRef(0);
    const velocityRef = useRef(0);

    const [sheetHeight, setSheetHeight] = useState(0);
    const [maxSheetHeight, setMaxSheetHeight] = useState(0);

    const minHeight = 80;
    const closeThresholdPercent = 0.5;

    useEffect(() => {
        const handleResize = () => setMobile(window.innerWidth <= 480);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Inicializa altura do Bottom Sheet
    useEffect(() => {
        if (mobile && sheetRef.current) {
            const height = sheetRef.current.scrollHeight;
            setSheetHeight(height);
            setMaxSheetHeight(height);
        }
    }, [mobile, children]);

    // Bloqueia scroll do fundo
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [isOpen]);

    const handleClose = () => setClosing(true);

    useEffect(() => {
        if (closing) {
            const timer = setTimeout(() => onClose(), 300);
            return () => clearTimeout(timer);
        }
    }, [closing, onClose]);

    // Drag handlers
    const handleDragStart = (e) => {
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startYRef.current = clientY;
        lastYRef.current = clientY;
        velocityRef.current = 0;
    };

    const handleDragMove = (e) => {
        if (!sheetRef.current) return;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const diff = lastYRef.current - clientY;
        velocityRef.current = diff;
        lastYRef.current = clientY;

        let newHeight = sheetHeight + diff;

        // Rebote para altura máxima
        if (newHeight > maxSheetHeight) {
            const excess = newHeight - maxSheetHeight;
            newHeight = maxSheetHeight + excess / 3;
        }

        // Fecha se arrastou abaixo da mínima
        if (newHeight < minHeight) {
            newHeight = minHeight;
            handleClose();
        }

        setSheetHeight(newHeight);
    };

    const handleDragEnd = () => {
        const closeThreshold = maxSheetHeight * closeThresholdPercent;

        // Rebote de volta para altura máxima se passou
        if (sheetHeight > maxSheetHeight) {
            setSheetHeight(maxSheetHeight);
        }
        // Fecha se arrastou abaixo do threshold ou arraste rápido para baixo
        else if (sheetHeight < closeThreshold || velocityRef.current < -15) {
            handleClose();
        }
        // Snap para altura máxima
        else {
            setSheetHeight(maxSheetHeight);
        }

        startYRef.current = 0;
        lastYRef.current = 0;
        velocityRef.current = 0;
    };

    if (!isOpen) return null;

    return (
        <div className={mobile ? "bottom-sheet" : "modal"}>
            {!mobile ? (
                <div className={`modal-wrapper ${closing ? "closing" : ""}`}>
                    <div
                        className="modal-container"
                        style={{ width, transition: velocityRef.current === 0 ? "height 0.2s ease" : "none" }}
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
                    className="bottom-sheet-container"
                    style={{ height: `${sheetHeight}px`, transition: velocityRef.current === 0 ? "height 0.2s ease" : "none" }}
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
