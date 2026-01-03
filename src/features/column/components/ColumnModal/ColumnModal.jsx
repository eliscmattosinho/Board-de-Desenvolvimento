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

    const {
        title,
        setTitle,
        color,
        setColor,
        description,
        setDescription,
        applyTo,
        setApplyTo,
        isInitialized,
        initialValues,
    } = useColumnForm(columnData);

    // Compara com o color.toUpperCase() para evitar o "salvar aberto"
    const isDirty = useDirtyCheck(
        initialValues,
        {
            title: title,
            color: color.toUpperCase(),
            description: description,
            applyTo: applyTo,
        },
        isInitialized
    );

    const canSave = useMemo(() => {
        const hasValidTitle = title.trim().length > 0;
        if (mode === "create") return hasValidTitle;
        return hasValidTitle && isDirty;
    }, [title, mode, isDirty]);

    const handleSave = () => {
        if (!canSave) return;
        onSave?.({
            title: title.trim(),
            color: color.toUpperCase(),
            applyTo,
            description: description.trim(),
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                            style={{ backgroundColor: color }}
                            onClick={() => setShowPicker((prev) => !prev)}
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

                    {showPicker &&
                        (isMobile ? (
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
