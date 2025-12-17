import React from "react";
import { useBottomSheet } from "@hooks/useBottomSheet";

export default function ModalMobile({
    title,
    children,
    onClose,
    showHeader = true,
    isOpen = true,
}) {

    // @TODO mudar comportamento de crud em mobile 
    // @TODO sobreposição de modal exclude, (op: canceldelete return to task/column id modal?)

    const {
        sheetRef,
        sheetHeight,
        animating,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    } = useBottomSheet({ isOpen, showHeader, onClose });

    if (!isOpen) return null;

    return (
        <div className="bottom-sheet">
            <div
                className={`bottom-sheet-container ${animating || ""}`}
                style={{
                    height: `${sheetHeight}px`,
                    transition: "height 0.25s ease",
                }}
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="bottom-sheet-handle"
                    role="presentation"
                    aria-hidden="true"
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onMouseMove={handleDragMove}
                    onTouchMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchEnd={handleDragEnd}
                />
                {showHeader && (
                    <header className="bottom-sheet-header">
                        {title && <h2 className="modal-title">{title}</h2>}
                    </header>
                )}
                <div className="bottom-sheet-body">{children}</div>
            </div>
        </div>
    );
}
