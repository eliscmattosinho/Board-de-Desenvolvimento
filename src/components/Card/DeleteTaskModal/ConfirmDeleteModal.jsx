import React from "react";
import "./ConfirmDeleteModal.css";

function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal">
            <div className="confirm-modal-content">
                <h3>Confirmar exclusão</h3>
                <p>Deseja mesmo excluir esta tarefa? Esta ação não pode ser desfeita.</p>

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
}

export default ConfirmDeleteModal;
