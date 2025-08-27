import React from "react";

function Column({ id, title, className, onDrop, onDragOver }) {
    return (
        <div className={`col-board ${className}`} id={id}>
            <div className="title-col-board">
                <h4 className={`col-title-board ${className.split(" ")[1]}`}>{title}</h4>
            </div>
            <div className={`col-items ${className.split(" ")[1]}-items`} onDrop={onDrop} onDragOver={onDragOver}>
            </div>
        </div>
    );
}

export default Column;
