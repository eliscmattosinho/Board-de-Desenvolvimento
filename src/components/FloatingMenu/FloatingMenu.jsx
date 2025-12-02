import React, { useState, useRef, useEffect, useCallback } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { showWarning } from "@utils/toastUtils";
import "./FloatingMenu.css";

function FloatingMenu({ onAddTask, onAddColumn, columns }) {
    const [open, setOpen] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const menuRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    useEffect(() => {
        const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        setIsTouch(touch);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!isTouch) {
            closeTimeoutRef.current = setTimeout(() => setOpen(false), 300);
        }
    }, [isTouch]);

    const handleMouseEnter = useCallback(() => {
        if (!isTouch) {
            clearTimeout(closeTimeoutRef.current);
            setOpen(true);
        }
    }, [isTouch]);

    const handleAddTaskClick = useCallback(() => {
        if (!columns || columns.length === 0) {
            showWarning("Ops! Não tenho para onde ir, crie algumas colunas primeiro.");
            setOpen(false);
            return;
        }
        onAddTask();
        setOpen(false);
    }, [onAddTask, columns]);

    const handleAddColumnClick = useCallback(() => {
        onAddColumn(columns.length);
        setOpen(false);
    }, [onAddColumn, columns]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    return (
        <div
            className="floating-menu-container"
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="menu-trigger"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Abrir menu de ações"
            >
                <CiCirclePlus size={24} className="add-component board-icon plus-icon" />
            </button>

            {open && (
                <div
                    className="floating-menu"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="menu-item" onClick={handleAddTaskClick}>
                        Adicionar tarefa
                    </button>
                    <button className="menu-item" onClick={handleAddColumnClick}>
                        Adicionar coluna
                    </button>
                </div>
            )}
        </div>
    );
}

export default FloatingMenu;
