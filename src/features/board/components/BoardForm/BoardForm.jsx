import React, { useState } from "react";
import { useModal } from "@context/ModalContext";
import Modal from "@components/Modal/Modal";
import { showWarning } from "@utils/toastUtils";

export default function BoardForm({ onConfirm }) {
    const [title, setTitle] = useState("");
    const { closeModal } = useModal();

    const handleSubmit = () => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            showWarning("O título do board não pode ficar vazio.");
            return;
        }

        onConfirm(trimmedTitle);
        closeModal();
    };

    return (
        <Modal
            title="Novo Board"
            onClose={closeModal}
            closeTooltip="Cancelar"
        >
            <div className="modal-content">
                <input
                    type="text"
                    id="boardTitle"
                    name="boardTitle"
                    placeholder="Título do board"
                    value={title}
                    className="input-entry"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="modal-action">
                    <button className="modal-btn btn-thematic" onClick={handleSubmit}>
                        Criar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
