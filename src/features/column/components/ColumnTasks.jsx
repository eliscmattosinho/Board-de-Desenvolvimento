import React, { useMemo } from "react";
import TaskItem from "./TaskItem/TaskItem";

const ColumnTasks = React.memo(
    ({ tasks, dragOverIndex, dragPosition, onTaskClick, onDragStart, onDropTask, onDragOverTask, onDragLeaveTask }) => {
        const renderedTasks = useMemo(() => {
            if (!tasks || tasks.length === 0) return null;

            return tasks.map((task) => (
                <React.Fragment key={task.id}>
                    {dragOverIndex === task.id && dragPosition === "above" && (
                        <div className="task-placeholder active"></div>
                    )}

                    <TaskItem
                        task={task}
                        onClick={onTaskClick}
                        onDragStart={onDragStart}
                        onDrop={(e) => onDropTask(e, task.id, dragPosition)}
                        onDragOver={(e) => onDragOverTask(e, task.id)}
                        onDragLeave={onDragLeaveTask}
                        dragPosition={dragOverIndex === task.id ? dragPosition : null}
                    />

                    {dragOverIndex === task.id && dragPosition === "below" && (
                        <div className="task-placeholder active"></div>
                    )}
                </React.Fragment>
            ));
        }, [tasks, dragOverIndex, dragPosition, onTaskClick, onDragStart, onDropTask, onDragOverTask, onDragLeaveTask]);

        return renderedTasks;
    }
);

export default ColumnTasks;
