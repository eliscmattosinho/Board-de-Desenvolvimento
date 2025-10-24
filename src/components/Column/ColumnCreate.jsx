import React, { useState, useEffect, useRef } from "react";
import "./ColumnCreate.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ColorPickerPanel from "./ColorPickerPanel";

export default function ColumnCreate({ isOpen, onClose, onSave, columnData }) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#02773aff");
    const [description, setDescription] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [applyTo, setApplyTo] = useState("fundo");

    const inputRef = useRef(null);

    useEffect(() => {
        if (columnData) {
            setTitle(columnData.title || "");
            setColor(columnData.color || "#02773aff");
            setDescription(columnData.description || "");
        } else {
            setTitle("");
            setColor("#02773aff");
            setDescription("");
        }
    }, [columnData]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (onSave) {
            onSave({
                title: title || "Nova Coluna",
                color,
                description,
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div
                className="modal-content column-create"
                onClick={() => {
                    if (showPicker) setShowPicker(false);
                }}
            >
                <button
                    type="button"
                    className="modal-close"
                    data-tooltip={"A coluna não será salva"}
                    onClick={onClose}
                >
                    <IoIosCloseCircleOutline size={25} />
                </button>

                <h2>Column</h2>

                <div className="col-create-content">
                    <div className="col-title-block">
                        <label className="col-title w-600" htmlFor="column-title">Título:</label>
                        <input
                            id="column-title"
                            className="input input-title"
                            placeholder="Título da coluna"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="col-color-block">
                        <label className="col-color w-600" htmlFor="column-color">Cor da coluna:</label>
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
                        <label className="col-description w-600" htmlFor="column-description">Descrição:</label>
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
                        data-tooltip="Salvar coluna"
                        onClick={handleSave}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
