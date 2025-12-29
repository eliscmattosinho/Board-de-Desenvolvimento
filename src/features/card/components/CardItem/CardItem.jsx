import React, { useEffect, useRef, useState } from "react";
import { useCardDrag } from "@board/context/CardDragContext";
import "./CardItem.css";

function CardItem({
  card,
  onClick,
  onPointerMove,
  onPointerLeave
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
      className={`item card-item ${dragging ? "ghost" : ""}`}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setDragging(true);
        startDrag(card);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        if (!isDraggingCard()) return;
        onPointerLeave?.();
      }}
      onClick={() => {
        if (dragging) return;
        onClick?.(card);
      }}
    >
      <h3 className="item-title">{card.title}</h3>
      <p className="item-description">
        {card.description || "Sem descrição."}
      </p>
    </div>
  );
}

export default React.memo(CardItem);
