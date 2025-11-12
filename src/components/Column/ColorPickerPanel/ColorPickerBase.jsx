import React, { useState } from "react";
import { HexColorPicker, RgbaStringColorPicker } from "react-colorful";

export const blendColorWithBackground = (rgba, bg = "#EFEFEF") => {
    const match = rgba.match(/\d+\.?\d*/g);
    if (!match) return rgba;
    const [r, g, b, a] = match.map(Number);
    const br = parseInt(bg.slice(1, 3), 16);
    const bg_ = parseInt(bg.slice(3, 5), 16);
    const bb = parseInt(bg.slice(5, 7), 16);
    const nr = Math.round((1 - a) * br + a * r);
    const ng = Math.round((1 - a) * bg_ + a * g);
    const nb = Math.round((1 - a) * bb + a * b);
    return `rgb(${nr},${ng},${nb})`;
};

export default function ColorPickerBase({ color, setColor, applyTo, setApplyTo, onClose, children }) {
    const [mode, setMode] = useState(color.startsWith("#") ? "hex" : "rgba");
    const [internalColor, setInternalColor] = useState(color);

    const toggleMode = () => {
        if (mode === "hex") {
            const r = parseInt(internalColor.slice(1, 3), 16);
            const g = parseInt(internalColor.slice(3, 5), 16);
            const b = parseInt(internalColor.slice(5, 7), 16);
            setInternalColor(`rgba(${r},${g},${b},1)`);
            setMode("rgba");
        } else {
            const match = internalColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
            if (match) {
                const [, r, g, b] = match;
                const hex = "#" + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, "0")).join("");
                setInternalColor(hex.toUpperCase());
            }
            setMode("hex");
        }
    };

    const handleColorChange = (newColor) => {
        setInternalColor(newColor);
        const blended = newColor.startsWith("rgba") ? blendColorWithBackground(newColor, "#EFEFEF") : newColor;
        setColor(blended);
    };

    const handleSwatchClick = (c) => handleColorChange(c);

    const handleClose = () => {
        // Apenas fecha o painel, cor já atualizada em tempo real
        onClose?.();
    };

    return (
        <div className="color-picker-base">
            {children({ internalColor, handleColorChange, mode, toggleMode, handleClose, handleSwatchClick, applyTo, setApplyTo })}
            <input
                className="input-entry picker-hex-input"
                value={internalColor.toUpperCase()}
                onChange={(e) => handleColorChange(e.target.value)}
            />
            {mode === "hex" ? (
                <HexColorPicker color={internalColor} onChange={handleColorChange} />
            ) : (
                <RgbaStringColorPicker color={internalColor} onChange={handleColorChange} />
            )}
            <div className="picker-swatches">
                {["#212121", "#2C7FA3", "#3DD6B3", "#2DD44A", "#008000", "#EFEFEF"].map((c) => (
                    <div
                        key={c}
                        className="swatch"
                        style={{ backgroundColor: c }}
                        onClick={() => handleSwatchClick(c)}
                    />
                ))}
            </div>
            <div className="picker-checkboxes">
                <label className="col-label">
                    <input type="radio" name="applyTo" checked={applyTo === "fundo"} onChange={() => setApplyTo("fundo")} />
                    Fundo
                </label>
                <label className="col-label">
                    <input type="radio" name="applyTo" checked={applyTo === "borda"} onChange={() => setApplyTo("borda")} />
                    Borda
                </label>
            </div>
        </div>
    );
}
