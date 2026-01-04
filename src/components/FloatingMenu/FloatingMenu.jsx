import React from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useFloatingMenu } from "@board/hooks/useFloatingMenu";
import "./FloatingMenu.css";

function FloatingMenu() {
    const {
        open,
        setOpen,
        menuRef,
        handleMouseEnter,
        handleMouseLeave,
        handleAddCardClick,
        handleAddColumnClick,
    } = useFloatingMenu();

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
                <CiCirclePlus
                    size={24}
                    className="add-component board-icon plus-icon"
                />
            </button>

            {open && (
                <div
                    className="floating-menu"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="menu-item" onClick={handleAddCardClick}>
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
