import React, { useState, useRef, useEffect } from "react";
import useColumnForm from "@column/hooks/useColumnForm";
import { useModal } from "@context/ModalContext";
import { useScreen } from "@context/ScreenContext";
import { showWarning } from "@utils/toastUtils";
import { getContrastColor } from "@column/utils/colorUtils";

import Modal from "@components/Modal/Modal";
import ColorPickerPanel from "../ColorPickerPanel/ColorPickerPanel";
import ColorPickerPanelMobile from "../ColorPickerPanel/ColorPickerMobile/ColorPickerPanelMobile";

import "./ColumnModal.css";

export default function ColumnModal({ onSave, columnData, mode = "create" }) {
    const { closeModal } = useModal();
    const { isMobile } = useScreen();

    const { title, setTitle, color, setColor, description, setDescription, applyTo, setApplyTo } =
        useColumnForm(columnData);

    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef(null);

    const handleSave = () => {
        if (!title || !title.trim()) return showWarning("O título não pode ficar vazio.");
        if (onSave) onSave({ title, color, applyTo, description });
        closeModal();
    };

    return (
        <Modal
            title={mode === "edit" ? "Editar coluna" : "Nova coluna"}
            onClose={closeModal}
            closeTooltip={mode === "edit" ? "Fechar" : "Cancelar criação"}
        >
            <div className="modal-content create-column-modal">
                <div className="modal-field col-title-block">
                    <label htmlFor="column-title" className="input-title">Título:</label>
                    <input
                        id="column-title"
                        className="input-entry"
                        placeholder="Título da coluna"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="modal-field col-color-block">
                    <label htmlFor="column-color" className="input-title col-color">Cor da coluna:</label>
                    <div className="color-input-wrapper">
                        <span
                            className="color-preview"
                            style={{ backgroundColor: color }}
                            onClick={() => setShowPicker(!showPicker)}
                        />
                        <input
                            ref={inputRef}
                            id="column-color"
                            className="input-entry input-color"
                            value={color.toUpperCase()}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="#000000 ou rgba(255,0,0,1)"
                        />
                    </div>

                    {showPicker && (
                        isMobile ? (
                            <ColorPickerPanelMobile
                                color={color}
                                setColor={setColor}
                                applyTo={applyTo}
                                setApplyTo={setApplyTo}
                                onClose={() => setShowPicker(false)}
                            />
                        ) : (
                            <ColorPickerPanel
                                color={color}
                                setColor={setColor}
                                applyTo={applyTo}
                                setApplyTo={setApplyTo}
                                onClose={() => setShowPicker(false)}
                                anchorRef={inputRef}
                            />
                        )
                    )}
                </div>

                <div className="modal-field col-description-block">
                    <label htmlFor="column-description" className="input-title col-description">Descrição:</label>
                    <textarea
                        id="column-description"
                        className="input-entry textarea-description"
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
