import React from "react";
import { CiTrash, CiEdit } from "react-icons/ci";

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
                    <CiTrash className="col-icon-left trash-icon" size={20} onClick={onRemove} />
                )}
                <p className="col-title-board">
                    {title}
                    <span className="task-counter">({tasksLength})</span>
                </p>
                {hovered && onEdit && (
                    <CiEdit className="col-icon-right edit-icon" size={20} onClick={onEdit} />
                )}
            </div>
        </div>
    );
});

export default ColumnHeader;
