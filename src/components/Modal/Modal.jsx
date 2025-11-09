import React from "react";
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
}) {
    return (
        <div className="modal" onClick={onClose}>
            <div
                className={`modal-container ${className}`}
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
                    onClick={onClose}
                    data-tooltip={closeTooltip}
                >
                    <IoIosCloseCircleOutline size={25} />
                </button>
            </div>
        </div>
    );
}
