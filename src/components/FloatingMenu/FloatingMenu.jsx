import React, { memo } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useFloatingMenu } from "@board/hooks/useFloatingMenu";
import "./FloatingMenu.css";

const FloatingMenu = memo(() => {
    const {
        open,
        toggleMenu,
        menuRef,
        handleMouseEnter,
        handleMouseLeave,
        handleAddCardClick,
        handleAddColumnClick,
    } = useFloatingMenu();

    return (
        <div
            className={`floating-menu-container ${open ? "is-active" : ""}`}
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="menu-trigger board-icon"
                onClick={toggleMenu}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Ações rápidas"
            >
                <CiCirclePlus size={24} className="plus-icon" />
            </button>

            {open && (
                <ul className="floating-menu" role="menu">
                    <li role="none">
                        <button
                            type="button"
                            className="menu-item"
                            onClick={handleAddCardClick}
                            role="menuitem"
                        >
                            Adicionar tarefa
                        </button>
                    </li>
                    <li role="none">
                        <button
                            type="button"
                            className="menu-item"
                            onClick={handleAddColumnClick}
                            role="menuitem"
                        >
                            Adicionar coluna
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
});

export default FloatingMenu;
