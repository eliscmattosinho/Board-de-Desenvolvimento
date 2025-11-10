import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker, RgbaStringColorPicker } from "react-colorful";
import { FiRefreshCcw } from "react-icons/fi";
import "./ColorPickerPanel.css";

/**
 * Pré-mistura rgba com fundo para manter a tonalidade esperada
 * rgba: "rgba(r,g,b,a)"
 * bg: "#RRGGBB"
 */
const blendColorWithBackground = (rgba, bg = "#EFEFEF") => {
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

export default function ColorPickerPanel({
    color,
    setColor,
    applyTo,
    setApplyTo,
    onClose,
    anchorRef,
}) {
    const panelRef = useRef(null);
    const [position, setPosition] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [mode, setMode] = useState(color.startsWith("#") ? "hex" : "rgba");

    // Mantém cor durante a edição, sem quebrar o alpha
    const [internalColor, setInternalColor] = useState(color);

    // Calcula posição inicial do painel
    useEffect(() => {
        const rect = anchorRef.current?.getBoundingClientRect();
        if (rect) {
            setPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            });
        }
    }, [anchorRef]);

    // Fechar o painel quando clicar fora
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                let finalColor = internalColor;
                if (finalColor.startsWith("rgba")) {
                    finalColor = blendColorWithBackground(finalColor, "#EFEFEF");
                }
                setColor(finalColor);
                onClose?.();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [internalColor, onClose, setColor]);

    // Funções de arrastar o painel
    const handleMouseDown = (e) => {
        if (e.target !== panelRef.current) return;
        e.preventDefault();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.left,
            y: e.clientY - position.top,
        });
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging || !panelRef.current) return;
            let newLeft = e.clientX - dragOffset.x;
            let newTop = e.clientY - dragOffset.y;

            const maxLeft = window.innerWidth - panelRef.current.offsetWidth;
            const maxTop =
                document.documentElement.scrollHeight - panelRef.current.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            setPosition({ left: newLeft, top: newTop });
        },
        [isDragging, dragOffset]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Alternar modo HEX/RGBA
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

    // Atualiza a cor interna e o preview em tempo real
    const handleColorChange = (newColor) => {
        setInternalColor(newColor);
        setColor(newColor);
    };

    if (!position) return null;

    return createPortal(
        <div
            className="color-picker-panel"
            ref={panelRef}
            style={{
                top: position.top,
                left: position.left,
                cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="picker-header">
                <label className="picker-label">{mode === "hex" ? "HEX" : "RGBA"}</label>
                <button
                    className="picker-mode-toggle"
                    onClick={toggleMode}
                    title="Alternar modo"
                >
                    <FiRefreshCcw size={16} />
                </button>
            </div>

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
                {["#212121", "#2C7FA3", "#3DD6B3", "#2DD44A", "#008000", "#EFEFEF"].map(
                    (c) => (
                        <div
                            key={c}
                            className="swatch"
                            style={{ backgroundColor: c }}
                            onClick={() => handleColorChange(c)}
                        />
                    )
                )}
            </div>

            <div className="picker-checkboxes">
                <label className="col-label">
                    <input
                        type="radio"
                        name="applyTo"
                        checked={applyTo === "fundo"}
                        onChange={() => setApplyTo("fundo")}
                    />
                    Fundo
                </label>
                <label className="col-label">
                    <input
                        type="radio"
                        name="applyTo"
                        checked={applyTo === "borda"}
                        onChange={() => setApplyTo("borda")}
                    />
                    Borda
                </label>
            </div>
        </div>,
        document.body
    );
}
