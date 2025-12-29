import React, { useEffect, useRef, useState } from "react";
import { useCardDrag } from "@board/context/CardDragContext";
import "./TaskItem.css";

function TaskItem({
  task,
  onClick,
  onPointerMove,
  onPointerLeave,
  dragPosition,
}) {
  const { startDrag, endDrag, isDraggingCard } = useCardDrag();
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Encerramento global seguro
  useEffect(() => {
    const handlePointerUp = () => {
      if (!dragging) return;
      setDragging(false);
      endDrag();
    };

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [dragging, endDrag]);

  const handlePointerMove = (e) => {
    if (!dragging || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const middleY = rect.top + rect.height / 2;
    const position = e.clientY < middleY ? "above" : "below";

    onPointerMove?.(e, position);
  };

  return (
    <div
      ref={ref}
      className={`item task-item ${dragging ? "ghost" : ""}`}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setDragging(true);
        startDrag(task);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        if (!isDraggingCard()) return;
        onPointerLeave?.();
      }}
      onClick={() => {
        if (dragging) return;
        onClick?.(task);
      }}
    >
      <h3 className="item-title">{task.title}</h3>
      <p className="item-description">
        {task.description || "Sem descrição."}
      </p>
    </div>
  );
}

export default React.memo(TaskItem);
