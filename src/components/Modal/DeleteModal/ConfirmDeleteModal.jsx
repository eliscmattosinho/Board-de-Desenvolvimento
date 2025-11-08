import React from "react";
import Modal from "../Modal";
import styles from "./ConfirmDeleteModal.module.css";

export default function ConfirmDeleteModal({
    isOpen,
    onConfirm,
    onCancel,
    type = "task",
}) {
    if (!isOpen) return null;

    const entityText = type === "column" ? "coluna" : "tarefa";

    return (
        <Modal title="" onClose={onCancel} width="360px">
            <div className={styles.confirmDeleteContent}>
                <h3 className={styles.confirmTitle}>Excluir {entityText}</h3>
                <p className={styles.confirmMessage}>
                    Deseja mesmo excluir a {entityText}? Esta ação não pode ser desfeita.
                </p>

                <div className={styles.confirmActions}>
                    <button className={`modal-btn ${styles.btnConfirm}`} onClick={onConfirm}>
                        Sim, excluir
                    </button>
                    <button className={`modal-btn ${styles.btnCancel}`} onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
