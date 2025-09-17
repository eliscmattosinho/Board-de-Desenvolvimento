import React from "react";

function TaskItem({ task, onClick, onDragStart, statusMap }) {
    // traduz status canônico para status exibdo na view atual
    // const displayStatus = statusMap[task.status] || task.status;

    return (
        <div
            id={task.id}
            className="item task-item"
            draggable="true"
            data-task-id={task.id}
            onDragStart={(e) => onDragStart(e, task.id)}
            onClick={() => onClick(task)}
        >
            <h3 className="item-title">{task.title}</h3>
            <p className="item-description">
                {task.description || "Sem descrição."}
            </p>
            {/* <p className="item-status">
                <strong>Status:</strong> {displayStatus}
            </p> */}
        </div>
    );
}

export default TaskItem;
