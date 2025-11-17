import React, { useEffect, useRef } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import { useScreen } from "@context/ScreenContext";

const ColumnHeader = React.memo(({ title, tasksLength, onEdit, onRemove, onDragOver, onDrop }) => {
    const [hovered, setHovered] = React.useState(false);
    const { isMobile } = useScreen();
    const containerRef = useRef(null);

    // Close when out (mobile)
    useEffect(() => {
        if (!isMobile || !hovered) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setHovered(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [hovered, isMobile]);

    return (
        <div
            ref={containerRef}
            className="col-title-container"
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            onClick={() => isMobile && setHovered((prev) => !prev)}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className="col-title-content">
                {hovered && onRemove && (
                    <button
                        className="board-icon col-icon-left trash-icon"
                        onClick={onRemove}
                        data-tooltip="Excluir coluna"
                    >
                        <IoTrashOutline size={20} />
                    </button>
                )}

                <p className={`col-title-board ${hovered ? "shrink" : ""}`}>
                    {title}
                    <span className="task-counter">({tasksLength})</span>
                </p>

                {hovered && onEdit && (
                    <button
                        className="board-icon col-icon-right edit-icon"
                        onClick={onEdit}
                        data-tooltip="Editar coluna"
                    >
                        <AiOutlineEdit size={20} />
                    </button>
                )}
            </div>
        </div>
    );
});

export default ColumnHeader;
