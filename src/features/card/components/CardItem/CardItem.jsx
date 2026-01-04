import React from "react";
import { useBoardLogic } from "@board/hooks/useBoardLogic";
import "./CardItem.css";

function CardItem({ card }) {
  const { onCardClick } = useBoardLogic();

  return (
    <div className="item card-item" onClick={() => onCardClick?.(card)}>
      <h3 className="item-title">{card.title}</h3>
      <p className="item-description">
        {card.description || "Sem descrição."}
      </p>
    </div>
  );
}

export default React.memo(CardItem);
