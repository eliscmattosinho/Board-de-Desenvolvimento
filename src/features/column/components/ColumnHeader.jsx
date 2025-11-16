import React from "react";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";

const ColumnHeader = React.memo(({ title, tasksLength, onEdit, onRemove, onDragOver, onDrop }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <div
            className="col-title-container"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
                <p className="col-title-board">
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
