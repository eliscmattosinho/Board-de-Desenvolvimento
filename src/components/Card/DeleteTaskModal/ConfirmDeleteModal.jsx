import React from "react";
import ReactDOM from "react-dom";
import "./ConfirmDeleteModal.css";

function ConfirmDeleteModal({ isOpen, onConfirm, onCancel, type = "task" }) {
    if (!isOpen) return null;

    const entityText = type === "column" ? "coluna" : "tarefa";

    const modalContent = (
        <div className="confirm-modal">
            <div className="confirm-modal-content">
                <h3>Confirmar exclusão</h3>
                <p>Deseja mesmo excluir esta {entityText}? Esta ação não pode ser desfeita.</p>

                <div className="confirm-modal-actions">
                    <button className="modal-btn btn-confirm" onClick={onConfirm}>
                        Sim, excluir
                    </button>
                    <button className="modal-btn btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}

export default ConfirmDeleteModal;
