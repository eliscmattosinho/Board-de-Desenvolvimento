import React, { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { lockBodyScroll, unlockBodyScroll } from "@utils/modalUtils";

export default function ModalDesktop({
    title,
    children,
    onClose,
    showHeader = true,
    width = "100%",
    className = "",
    closeTooltip = "Fechar",
    isOpen = true,
}) {
    const [animationState, setAnimationState] = useState("opening");

    useEffect(() => {
        if (!isOpen) {
            unlockBodyScroll();
            return;
        }

        lockBodyScroll();
        setAnimationState("opening");

        const timer = setTimeout(() => setAnimationState(""), 300);

        return () => {
            clearTimeout(timer);
            unlockBodyScroll();
        };
    }, [isOpen]);

    const handleClose = () => {
        setAnimationState("closing");
        setTimeout(() => onClose(), 250);
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div
                className={`modal-container ${className} ${animationState}`}
                style={{ width }}
            >
                <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
                    {showHeader && (
                        <div className="modal-header">
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
        </div>
    );
}
