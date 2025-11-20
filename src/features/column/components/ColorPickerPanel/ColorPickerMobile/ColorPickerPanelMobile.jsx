import React from "react";
import { createPortal } from "react-dom";
import { FiX, FiRefreshCcw } from "react-icons/fi";

import ColorPickerBase from "../ColorPickerBase";

import "./ColorPickerPanel.mobile.css"

export default function ColorPickerPanelMobile({ color, setColor, applyTo, setApplyTo, onClose }) {
    const content = (
        <div className="bottom-sheet">
            <div className="bottom-sheet-container">
                <ColorPickerBase color={color} setColor={setColor} applyTo={applyTo} setApplyTo={setApplyTo} onClose={onClose}>
                    {({ mode, toggleMode, handleClose }) => (
                        <>
                            <div className="picker-header">
                                <span className="color-picker-title w-600">Selecione a cor</span>
                                <button className="picker-mode-toggle" onClick={handleClose} title="Fechar">
                                    <FiX size={20} />
                                </button>
                            </div>
                            <div className="picker-mode">
                                <label className="w-600">{mode === "hex" ? "HEX" : "RGBA"}</label>
                                <button className="picker-mode-toggle" onClick={toggleMode} title="Alternar modo">
                                    <FiRefreshCcw size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </ColorPickerBase>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}
