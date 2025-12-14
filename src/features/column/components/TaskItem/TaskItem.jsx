import React from 'react';
import { useDragEvents } from '@column/hooks/useDragEvents';
import './TaskItem.css';

function TaskItem({
  task,
  onClick,
  onDragStart,
  onDrop,
  onDragOver,
  onDragLeave,
  dragPosition,
}) {
  const { handleDragStart, handleDrop, handleDragOver, handleDragLeave } = useDragEvents(
    task.id,
    onDragStart,
    onDrop,
    onDragOver,
    onDragLeave
  );

  return (
    <div
      id={task.id}
      className={`item task-item ${dragPosition === 'above' ? 'drag-over-above' : dragPosition === 'below' ? 'drag-over-below' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick?.(task)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <h3 className="item-title">{task.title}</h3>
      <p className="item-description">{task.description || 'Sem descrição.'}</p>
    </div>
  );
}

/**
 * Memoização segura:
 * re-renderiza apenas quando dados relevantes mudam
 */
export default React.memo(TaskItem, (prev, next) => {
  return (
    prev.task.id === next.task.id &&
    prev.task.title === next.task.title &&
    prev.task.description === next.task.description &&
    prev.dragPosition === next.dragPosition
  );
});
