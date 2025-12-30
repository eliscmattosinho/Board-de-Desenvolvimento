import React from "react";
import "./CardItem.css";

function CardItem({ card, onClick }) {
  return (
    <div
      className="item card-item"
      onClick={() => onClick?.(card)}
    >
      <h3 className="item-title">{card.title}</h3>
      <p className="item-description">
        {card.description || "Sem descrição."}
      </p>
    </div>
  );
}

export default React.memo(CardItem);
