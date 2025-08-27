import React from "react";
import Column from "./Column";

function BoardSection({ id, columns, onDrop, onDragOver }) {
    return (
        <div id={id} className={`board ${id}-board`}>
            {columns.map((col) => (
                <Column
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    className={col.className}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                />
            ))}
        </div>
    );
}

export default BoardSection;
