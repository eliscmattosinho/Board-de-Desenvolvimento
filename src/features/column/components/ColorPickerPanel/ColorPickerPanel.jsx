import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiRefreshCcw } from "react-icons/fi";

import useFloatingPanel from "@column/hooks/useFloatingPanel";
import ColorPickerBase from "./ColorPickerBase";

import "./ColorPickerPanel.css";

export default function ColorPickerPanel({
    color,
    setColor,
    applyTo,
    setApplyTo,
    onClose,
    anchorRef
}) {
    const panelRef = useRef(null);

    const {
        position,
        isDragging,
        handleMouseDown,
        handleTouchStart
    } = useFloatingPanel(panelRef, anchorRef);

    // fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!position) return null;

    return createPortal(
        <div
            className="color-picker-panel"
            ref={panelRef}
            style={{
                top: position.top,
                left: position.left,
                cursor: isDragging ? "grabbing" : "grab"
            }}
            onMouseDown={(e) => {
                if (
                    e.target.tagName === "INPUT" ||
                    e.target.tagName === "BUTTON" ||
                    e.target.closest(".react-colorful") ||
                    e.target.classList.contains("color-preview")
                ) return;

                handleMouseDown(e);
            }}
            onTouchStart={(e) => {
                if (
                    e.target.tagName === "INPUT" ||
                    e.target.tagName === "BUTTON" ||
                    e.target.closest(".react-colorful") ||
                    e.target.classList.contains("color-preview")
                ) return;

                handleTouchStart(e);
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <ColorPickerBase
                color={color}
                setColor={setColor}
                applyTo={applyTo}
                setApplyTo={setApplyTo}
                onClose={onClose}
            >
                {({ mode, toggleMode }) => (
                    <div className="picker-header">
                        <label className="picker-label w-600">
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
                )}
            </ColorPickerBase>
        </div>,
        document.body
    );
}
