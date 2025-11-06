import React, { useState, useRef, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import "./FloatingMenu.css";

function FloatingMenu({ onAddTask, onAddColumn }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => setOpen(false), 300);
    };

    const handleMouseEnter = () => {
        clearTimeout(closeTimeoutRef.current);
        setOpen(true);
    };

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
                <CiCirclePlus size={24} className="add-component" />
            </button>

            {open && (
                <div
                    className="floating-menu light"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="menu-item light" onClick={onAddTask}>
                        Adicionar tarefa
                    </button>
                    <button className="menu-item light" onClick={onAddColumn}>
                        Adicionar coluna
                    </button>
                </div>
            )}
        </div>
    );
}

export default FloatingMenu;
