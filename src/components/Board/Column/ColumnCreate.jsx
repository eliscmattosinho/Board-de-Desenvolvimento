import React, { useState, useRef } from "react";
import "./ColumnCreate.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ColorPickerPanel from "./ColorPickerPanel";

export default function ColumnCreate({ isOpen, onClose }) {
    const [color, setColor] = useState("#02773aff");
    const [showPicker, setShowPicker] = useState(false);
    const [applyTo, setApplyTo] = useState("fundo"); //padrão

    const inputRef = useRef(null);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div
                className="modal-content column-create"
                onClick={() => {
                    if (showPicker) setShowPicker(false); // fecha o painel de cor ao clicar no card
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

                <h2>
                    Column <span className="col-id"></span>
                </h2>

                <div className="col-create-content">
                    {/* Título */}
                    <div className="col-title-block">
                        <label className="col-title w-600" htmlFor="column-title">
                            Título:
                        </label>
                        <input
                            id="column-title"
                            className="input input-title"
                            placeholder="Título da coluna"
                        />
                    </div>

                    {/* Cor */}
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

                    {/* Descrição */}
                    <div className="col-description-block">
                        <label className="col-description w-600" htmlFor="column-description">
                            Descrição:
                        </label>
                        <textarea
                            id="column-description"
                            className="input textarea-description"
                            placeholder="Descrição (opcional)"
                            rows={4}
                        />
                    </div>

                    {/* Save column */}
                    <button
                        type="button"
                        className="modal-btn btn-save"
                        data-tooltip="Salvar coluna"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
