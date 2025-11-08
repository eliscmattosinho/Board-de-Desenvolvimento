import React, { useState, useRef } from "react";
import ColorPickerPanel from "../ColorPickerPanel/ColorPickerPanel.jsx";
import useColumnForm from "../../../hooks/useColumnForm.js";
import Modal from "../../Modal/Modal.jsx";
import { useModal } from "../../../context/ModalContext";
import "./ColumnModal.css";

export default function ColumnModal({ onSave, columnData, mode = "create" }) {
    const { closeModal } = useModal();

    const {
        title,
        setTitle,
        color,
        setColor,
        description,
        setDescription,
        applyTo,
        setApplyTo,
    } = useColumnForm(columnData);

    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef(null);

    const handleSave = () => {
        if (!onSave) return;
        onSave({
            title: title || "Nova coluna",
            color,
            applyTo,
            description,
        });
        closeModal();
    };

    return (
        <Modal
            title={mode === "edit" ? "Editar coluna" : "Nova coluna"}
            onClose={closeModal}
            width="500px"
            closeTooltip={mode === "edit" ? "Fechar" : "Cancelar criação"}
        >
            <div
                className="col-create-content"
                onClick={() => showPicker && setShowPicker(false)}
            >
                <div className="col-title-block">
                    <label className="col-title w-600" htmlFor="column-title">
                        Título:
                    </label>
                    <input
                        id="column-title"
                        className="input input-title"
                        placeholder="Título da coluna"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="col-color-block">
                    <label className="col-color w-600" htmlFor="column-color">
                        Cor da coluna:
                    </label>
                    <div className="color-input-wrapper">
                        <span
                            className="color-preview"
                            style={{ backgroundColor: color }}
                            onClick={() => setShowPicker(!showPicker)}
                        />
                        <input
                            ref={inputRef}
                            id="column-color"
                            className="input input-color"
                            value={color.toUpperCase()}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="#000000 ou rgba(255,0,0,1)"
                        />
                    </div>

                    {showPicker && (
                        <ColorPickerPanel
                            color={color}
                            setColor={setColor}
                            applyTo={applyTo}
                            setApplyTo={setApplyTo}
                            onClose={() => setShowPicker(false)}
                            anchorRef={inputRef}
                        />
                    )}
                </div>

                <div className="col-description-block">
                    <label className="col-description w-600" htmlFor="column-description">
                        Descrição:
                    </label>
                    <textarea
                        id="column-description"
                        className="input textarea-description"
                        placeholder="Descrição (opcional)"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="modal-btn btn-save"
                    data-tooltip={mode === "edit" ? "Salvar alterações" : "Salvar coluna"}
                    onClick={handleSave}
                >
                    Salvar
                </button>
            </div>
        </Modal>
    );
}
