import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker, RgbaStringColorPicker } from "react-colorful";
import { FiRefreshCcw } from "react-icons/fi";
import "./ColorPickerPanel.css";

export default function ColorPickerPanel({ color, setColor, applyTo, setApplyTo, onClose, anchorRef }) {
    const panelRef = useRef(null);
    const [position, setPosition] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [mode, setMode] = useState("hex");

    // calcula posição inicial
    //modularizar modal para card, col e bord
    useEffect(() => {
        const rect = anchorRef.current?.getBoundingClientRect();
        if (rect) {
            setPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            });
        }
    }, [anchorRef]);

    // funções de arrastar
    const handleMouseDown = (e) => {
        if (e.target !== panelRef.current) return;
        e.preventDefault();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.left,
            y: e.clientY - position.top,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !panelRef.current) return;
        let newLeft = e.clientX - dragOffset.x;
        let newTop = e.clientY - dragOffset.y;

        const maxLeft = window.innerWidth - panelRef.current.offsetWidth;
        const maxTop =
            document.documentElement.scrollHeight - panelRef.current.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        setPosition({ left: newLeft, top: newTop });
    };

    const handleMouseUp = () => setIsDragging(false);

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
    }, [isDragging, dragOffset]);

    // alternar modos
    const toggleMode = () => {
        if (mode === "hex") {
            // converte HEX → RGBA
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            setColor(`rgba(${r}, ${g}, ${b}, 1)`);
            setMode("rgba");
        } else {
            // converte RGBA → HEX
            const match = color.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
            );
            if (match) {
                const [_, r, g, b] = match;
                const hex =
                    "#" +
                    [r, g, b]
                        .map((x) => parseInt(x).toString(16).padStart(2, "0"))
                        .join("");
                setColor(hex);
            }
            setMode("hex");
        }
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
                <label className="picker-label" htmlFor="picker-hex-input">
                    {mode === "hex" ? "HEX" : "RGBA"}
                </label>
                <button
                    className="picker-mode-toggle"
                    onClick={toggleMode}
                    title="Alternar modo"
                >
                    <FiRefreshCcw size={16} />
                </button>
            </div>

            <input
                id="picker-hex-input"
                className="input-entry picker-hex-input"
                value={color.toUpperCase()}
                onChange={(e) => setColor(e.target.value)}
            />

            {mode === "hex" ? (
                <HexColorPicker color={color} onChange={setColor} />
            ) : (
                <RgbaStringColorPicker color={color} onChange={setColor} />
            )}

            <div className="picker-swatches">
                {["#212121", "#2C7FA3", "#3DD6B3", "#2DD44A", "#008000", "#EFEFEF"].map(
                    (c) => (
                        <div
                            key={c}
                            className="swatch"
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
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
