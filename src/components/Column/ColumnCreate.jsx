import React, { useState, useEffect, useRef } from "react";
import "./ColumnCreate.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ColorPickerPanel from "./ColorPickerPanel";
import { columnStyles } from "../../constants/columnStyles.js";

export default function ColumnCreate({ isOpen, onClose, onSave, columnData }) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#02773aff");
    const [description, setDescription] = useState("");
    const [applyTo, setApplyTo] = useState("fundo");
    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef(null);

    // Determina cor e aplicação (fundo ou borda)
    const determineColor = (colData) => {
        if (!colData) return { color: "#02773aff", applyTo: "fundo" };

        if (colData.color) return { color: colData.color, applyTo: colData.applyTo || "fundo" };

        if (colData.className) {
            const key = colData.className.split(" ")[1];
            const style = columnStyles[key];
            if (style) {
                if (style.bg !== "transparent") return { color: style.bg, applyTo: "fundo" };
                if (style.border !== "transparent") return { color: style.border, applyTo: "borda" };
            }
        }

        return { color: "#02773aff", applyTo: "fundo" };
    };

    // Atualiza estados ao abrir modal ou mudar columnData
    useEffect(() => {
        if (columnData) {
            setTitle(columnData.title || "");
            setDescription(columnData.description || "");
            const { color: c, applyTo: a } = determineColor(columnData);
            setColor(c);
            setApplyTo(a);
        } else {
            setTitle("");
            setDescription("");
            const { color: c, applyTo: a } = determineColor(null);
            setColor(c);
            setApplyTo(a);
        }
    }, [columnData]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (onSave) {
            onSave({
                title: title || "Nova Coluna",
                color,
                applyTo,
                description,
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div
                className="modal-content column-create"
                onClick={() => showPicker && setShowPicker(false)}
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
