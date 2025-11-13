import React, { useState, useEffect, useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { lockBodyScroll, unlockBodyScroll } from "@utils/modalUtils";

export default function ModalDesktop({
    title,
    children,
    onClose,
    showHeader = true,
    width = "350px",
    className = "",
    closeTooltip = "Fechar",
    isOpen = true,
}) {
    const [animating, setAnimating] = useState("opening");
    const sheetRef = useRef(null);
    const velocityRef = useRef(0);

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

    const handleClose = () => {
        setAnimating("closing");
        setTimeout(() => onClose(), 250);
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className={`modal-wrapper ${animating === "closing" ? "closing" : ""}`}>
                <div
                    className={`modal-container ${className}`}
                    style={{
                        width,
                        transition: velocityRef.current === 0 ? "height 0.2s ease" : "none",
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
        </div>
    );
}
