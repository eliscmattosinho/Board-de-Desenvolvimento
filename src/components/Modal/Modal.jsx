import React, { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "./Modal.css";

/**
 * Modal genérico reutilizável
 * 
 * Props:
 * - title (string): título opcional do modal
 * - children (ReactNode): conteúdo interno
 * - onClose (function): callback ao fechar
 * - showHeader (boolean): exibir header com título (default = true)
 * - width (string): largura customizável
 * - className (string): classes extras para estilização
 * - closeTooltip (string): texto do tooltip do botão de fechar
 */
export default function Modal({
    title,
    children,
    onClose,
    showHeader = true,
    width = "600px",
    className = "",
    closeTooltip = "Fechar",
    isOpen = true,
}) {
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
    };

    useEffect(() => {
        if (closing) {
            const timer = setTimeout(() => {
                onClose();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [closing, onClose]);

    return (
        <div className="modal">
            <div className={`modal-wrapper ${closing ? "closing" : ""}`}>
                <div
                    className="modal-container"
                    style={{ maxWidth: width }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {showHeader && (
                        <div className="modal-header-row">
                            {title && <h2 className="modal-title w-600">{title}</h2>}
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
