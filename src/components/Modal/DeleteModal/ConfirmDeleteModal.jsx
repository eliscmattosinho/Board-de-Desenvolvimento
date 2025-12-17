import React from "react";

import Modal from "../Modal";
import "./ConfirmDeleteModal.css";

export default function ConfirmDeleteModal({
    isOpen,
    onConfirm,
    onCancel,
    type = "task",
}) {
    if (!isOpen) return null;

    const entityText = type === "column" ? "coluna" : "tarefa";

    return (
        <Modal
            title={`Excluir ${entityText}`}
            onClose={onCancel}
            showHeader={false}
            width="300px"
        >
            <div className="modal-content modal-delete">
                <h2 className="modal-title modal-del-title text-alert">Excluir {entityText}</h2>
                <p>
                    Deseja mesmo excluir a {entityText}? Esta ação não pode ser desfeita.
                </p>

                <div className="modal-actions">
                    <button className="modal-btn btn-delete" onClick={onConfirm}>
                        Sim, excluir
                    </button>
                    <button className="modal-btn btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
