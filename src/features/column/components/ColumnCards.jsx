import React, { useMemo } from "react";
import CardItem from "@card/components/CardItem/CardItem";

const ColumnCards = React.memo(
  ({ cards = [], dropIndicator, onCardClick }) => {
    const renderedCards = useMemo(() => {
      if (cards.length === 0) return null;

      return cards.map((card) => {
        const isAbove =
          dropIndicator?.cardId === card.id &&
          dropIndicator.position === "above";

        const isBelow =
          dropIndicator?.cardId === card.id &&
          dropIndicator.position === "below";

        return (
          <React.Fragment key={card.id}>
            {isAbove && (
              <div className="card-placeholder active" />
            )}

            <CardItem
              card={card}
              onClick={onCardClick}
            />

            {isBelow && (
              <div className="card-placeholder active" />
            )}
          </React.Fragment>
        );
      });
    }, [cards, dropIndicator, onCardClick]);

    return renderedCards;
  }
);

export default ColumnCards;
