import React from "react";
import TaskItem from "./TaskItem";

function Column({ id, title, className, onDrop, onDragOver, tasks, onTaskClick, onDragStart, statusMap }) {
    return (
        <div className={`col-board ${className}`} id={id}>
            <div className="title-col-board">
                <h4 className={`col-title-board ${className.split(" ")[1]}`}>
                    {title}<span className="task-counter">({tasks.length})</span>
                </h4>
            </div>
            <div
                className={`col-items ${className.split(" ")[1]}-items`}
                onDrop={(e) => onDrop(e, id)}
                onDragOver={onDragOver}
            >
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onClick={onTaskClick}
                        onDragStart={onDragStart}
                        statusMap={statusMap}
                    />
                ))}
            </div>
        </div>
    );
}

export default Column;
