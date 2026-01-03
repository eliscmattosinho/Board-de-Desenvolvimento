import React, { useState, useRef, useMemo } from "react";
import useColumnForm from "@column/hooks/useColumnForm";
import { useModal } from "@context/ModalContext";
import { useScreen } from "@context/ScreenContext";
import { useDirtyCheck } from "@hooks/useDirtyCheck";
import Modal from "@components/Modal/Modal";
import ColorPickerPanel from "../ColorPickerPanel/ColorPickerPanel";
import ColorPickerPanelMobile from "../ColorPickerPanel/ColorPickerMobile/ColorPickerPanelMobile";
import "./ColumnModal.css";

export default function ColumnModal({ columnData, mode = "create", onSave }) {
    const { closeModal } = useModal();
    const { isMobile } = useScreen();
    const inputRef = useRef(null);
    const [showPicker, setShowPicker] = useState(false);

    const form = useColumnForm(columnData);

    const isDirty = useDirtyCheck(
        form.initialValues,
        {
            title: form.title,
            color: form.color.toUpperCase(),
            description: form.description,
            applyTo: form.applyTo,
        },
        form.isInitialized
    );

    // VALIDAÇÃO:
    // O título não pode ser apenas espaços.
    // Se for edição, tem que estar 'dirty'. Se for criação, basta ter título.
    const canSave = useMemo(() => {
        const hasValidTitle = form.title.trim().length > 0;

        if (mode === "create") return hasValidTitle;
        return isDirty && hasValidTitle;
    }, [form.title, mode, isDirty]);

    const handleSave = () => {
        if (!canSave) return;

        // Enviamos os dados já limpos
        onSave?.({
            title: form.title.trim(),
            color: form.color.toUpperCase(),
            applyTo: form.applyTo,
            description: form.description.trim(),
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
                {/* Título */}
                <div className="modal-field col-title-block">
                    <label htmlFor="column-title" className="input-title">
                        Título:
                    </label>
                    <input
                        id="column-title"
                        className="input-entry"
                        placeholder="Título da coluna"
                        value={form.title}
                        onChange={(e) => form.setTitle(e.target.value)}
                    />
                </div>

                {/* Cor */}
                <div className="modal-field col-color-block">
                    <label htmlFor="column-color" className="input-title col-color">
                        Cor da coluna:
                    </label>

                    <div className="color-input-wrapper">
                        <span
                            className="color-preview"
                            style={{ backgroundColor: form.color }}
                            onClick={() => setShowPicker((prev) => !prev)}
                        />
                        <input
                            ref={inputRef}
                            id="column-color"
                            className="input-entry input-color"
                            value={form.color.toUpperCase()}
                            onChange={(e) => form.setColor(e.target.value)}
                            placeholder="#000000 ou rgba(255,0,0,1)"
                        />
                    </div>

                    {showPicker &&
                        (isMobile ? (
                            <ColorPickerPanelMobile
                                color={form.color}
                                setColor={form.setColor}
                                applyTo={form.applyTo}
                                setApplyTo={form.setApplyTo}
                                onClose={() => setShowPicker(false)}
                            />
                        ) : (
                            <ColorPickerPanel
                                color={form.color}
                                setColor={form.setColor}
                                applyTo={form.applyTo}
                                setApplyTo={form.setApplyTo}
                                onClose={() => setShowPicker(false)}
                                anchorRef={inputRef}
                            />
                        ))}
                </div>

                {/* Descrição */}
                <div className="modal-field col-description-block">
                    <label
                        htmlFor="column-description"
                        className="input-title col-description"
                    >
                        Descrição:
                    </label>
                    <textarea
                        id="column-description"
                        className="input-entry textarea-description"
                        placeholder="Descrição (opcional)"
                        rows={4}
                        value={form.description}
                        onChange={(e) => form.setDescription(e.target.value)}
                    />
                </div>

                {/* Salvar */}
                <button
                    type="button"
                    className={`modal-btn btn-save ${canSave ? "active" : "disabled"}`}
                    data-tooltip={mode === "edit" ? "Salvar alterações" : "Salvar coluna"}
                    onClick={handleSave}
                    disabled={!canSave}
                >
                    Salvar
                </button>
            </div>
        </Modal>
    );
}
