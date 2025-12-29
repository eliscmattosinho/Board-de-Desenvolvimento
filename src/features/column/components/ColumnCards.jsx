import React, { useMemo } from "react";
import CardItem from "./CardItem/CardItem";

const ColumnCards = React.memo(
  ({
    cards,
    dragOverIndex,
    dragPosition,
    onCardClick,
    onHoverCard,
    onLeaveCard,
  }) => {
    const renderedCards = useMemo(() => {
      if (!cards || cards.length === 0) return null;

      return cards.map((card) => (
        <React.Fragment key={card.id}>
          {dragOverIndex === card.id &&
            dragPosition === "above" && (
              <div className="card-placeholder active"></div>
            )}

          <CardItem
            card={card}
            onClick={onCardClick}
            onPointerMove={(e, position) =>
              onHoverCard(card.id, position)
            }
            onPointerLeave={onLeaveCard}
            dragPosition={
              dragOverIndex === card.id ? dragPosition : null
            }
          />

          {dragOverIndex === card.id &&
            dragPosition === "below" && (
              <div className="card-placeholder active"></div>
            )}
        </React.Fragment>
      ));
    }, [
      cards,
      dragOverIndex,
      dragPosition,
      onCardClick,
      onHoverCard,
      onLeaveCard,
    ]);

    return renderedCards;
  }
);

export default ColumnCards;
