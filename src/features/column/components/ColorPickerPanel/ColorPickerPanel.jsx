import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiRefreshCcw } from "react-icons/fi";
import ColorPickerBase from "./ColorPickerBase";
import "./ColorPickerPanel.css";

export default function ColorPickerPanel({ color, setColor, applyTo, setApplyTo, onClose, anchorRef }) {
    const panelRef = useRef(null);
    const [position, setPosition] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // posicionamento inicial
    useEffect(() => {
        const rect = anchorRef.current?.getBoundingClientRect();
        if (rect) setPosition({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    }, [anchorRef]);

    // fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // arraste
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragOffset({ x: e.clientX - position.left, y: e.clientY - position.top });
        document.body.style.userSelect = "none";
    };

    const handleMouseMove = useCallback(
        (e) => {
            if (!isDragging) return;
            let newLeft = e.clientX - dragOffset.x;
            let newTop = e.clientY - dragOffset.y;
            const maxLeft = window.innerWidth - panelRef.current.offsetWidth;
            const maxTop = document.documentElement.scrollHeight - panelRef.current.offsetHeight;
            setPosition({ left: Math.max(0, Math.min(newLeft, maxLeft)), top: Math.max(0, Math.min(newTop, maxTop)) });
        },
        [isDragging, dragOffset]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        document.body.style.userSelect = ""; // restaura
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

    if (!position) return null;

    return createPortal(
        <div
            className="color-picker-panel"
            ref={panelRef}
            style={{ top: position.top, left: position.left, cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={(e) => {
                // drag apenas em áreas vazias, não em input/button/color picker/preview
                if (
                    e.target.tagName === "INPUT" ||
                    e.target.tagName === "BUTTON" ||
                    e.target.closest(".react-colorful") ||
                    e.target.classList.contains("color-preview")
                ) return;
                handleMouseDown(e);
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
                        <label className="picker-label">{mode === "hex" ? "HEX" : "RGBA"}</label>
                        <button className="picker-mode-toggle" onClick={toggleMode} title="Alternar modo">
                            <FiRefreshCcw size={16} />
                        </button>
                    </div>
                )}
            </ColorPickerBase>
        </div>,
        document.body
    );
}
