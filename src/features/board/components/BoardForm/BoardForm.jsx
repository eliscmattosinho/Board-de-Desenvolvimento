import React, { useState, useEffect, useRef } from "react";
import { useModal } from "@context/ModalContext";
import Modal from "@components/Modal/Modal";
import { showWarning } from "@utils/toastUtils";

export default function BoardForm({ onConfirm }) {
    const [title, setTitle] = useState("");
    const { closeModal } = useModal();
    const inputRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            showWarning("O título do board não pode ficar vazio.", {
                toastId: "empty-board-title",
            });
            return;
        }

        onConfirm(trimmedTitle);
        closeModal();
    };

    return (
        <Modal title="Novo Board" onClose={closeModal} closeTooltip="Cancelar">
            <form className="modal-content" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    id="boardTitle"
                    name="boardTitle"
                    placeholder="Título do board"
                    value={title}
                    className="input-entry"
                    autoComplete="off"
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="modal-action">
                    <button
                        type="submit"
                        className="modal-btn btn-thematic"
                        disabled={!title.trim()}
                    >
                        Criar
                    </button>
                </div>
            </form>
        </Modal>
    );
}
