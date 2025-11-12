import React, { useState, useRef } from "react";

import useColumnForm from "../../../hooks/useColumnForm.js";
import { useModal } from "../../../context/ModalContext";
import { useScreen } from "../../../context/ScreenContext";

import Modal from "../../Modal/Modal";
import ColorPickerPanel from "../ColorPickerPanel/ColorPickerPanel";
import ColorPickerPanelMobile from "../ColorPickerPanel/ColorPickerMobile/ColorPickerPanelMobile.jsx";

import "./ColumnModal.css";

export default function ColumnModal({ onSave, columnData, mode = "create" }) {
    const { closeModal } = useModal();
    const { isMobile } = useScreen();

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
            closeTooltip={mode === "edit" ? "Fechar" : "Cancelar criação"}
        >
            <div className="modal-content create-column-modal">
                {/* TÍTULO */}
                <div className="modal-field col-title-block">
                    <label className="input-title" htmlFor="column-title">
                        Título:
                    </label>
                    <input
                        id="column-title"
                        className="input-entry"
                        placeholder="Título da coluna"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* COR */}
                <div className="modal-field col-color-block">
                    <label className="input-title col-color" htmlFor="column-color">
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
                            className="input-entry input-color"
                            value={color.toUpperCase()}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="#000000 ou rgba(255,0,0,1)"
                        />
                    </div>

                    {/* COLOR PICKER */}
                    {showPicker && (
                        <>
                            {isMobile ? (
                                // Mobile: bottom sheet, fora do ColumnModal
                                // @TODO buscar outra forma, sem duplicação de definições com "sobreposição" de modais
                                <ColorPickerPanelMobile
                                    color={color}
                                    setColor={setColor}
                                    applyTo={applyTo}
                                    setApplyTo={setApplyTo}
                                    onClose={() => setShowPicker(false)}
                                />
                            ) : (
                                // Desktop: flutuante, dentro do ColumnModal
                                <ColorPickerPanel
                                    color={color}
                                    setColor={setColor}
                                    applyTo={applyTo}
                                    setApplyTo={setApplyTo}
                                    onClose={() => setShowPicker(false)}
                                    anchorRef={inputRef}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* DESCRIÇÃO */}
                <div className="modal-field col-description-block">
                    <label className="input-title col-description" htmlFor="column-description">
                        Descrição:
                    </label>
                    <textarea
                        id="column-description"
                        className="input-entry textarea-description"
                        placeholder="Descrição (opcional)"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* BOTÃO SALVAR */}
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
