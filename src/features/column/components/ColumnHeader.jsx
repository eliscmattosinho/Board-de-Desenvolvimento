import React from "react";
import { CiTrash, CiEdit } from "react-icons/ci";

const ColumnHeader = React.memo(({ title, tasksLength, onEdit, onRemove, onDragOver, onDrop }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <div
            className="title-col-board"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className="col-title-flex">
                {hovered && onRemove && (
                    <CiTrash className="col-icon-left" size={20} onClick={onRemove} />
                )}
                <h4 className="col-title-board">
                    {title} <span className="task-counter">({tasksLength})</span>
                </h4>
                {hovered && onEdit && (
                    <CiEdit className="col-icon-right" size={20} onClick={onEdit} />
                )}
            </div>
        </div>
    );
});

export default ColumnHeader;
