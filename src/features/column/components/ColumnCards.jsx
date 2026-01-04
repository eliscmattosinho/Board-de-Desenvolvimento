import React, { useMemo } from "react";
import CardItem from "@card/components/CardItem/CardItem";
import { useBoardLogic } from "@board/hooks/useBoardLogic";

const ColumnCards = React.memo(({ columnId }) => {
  const { cardsByColumn } = useBoardLogic();

  const cards = cardsByColumn[columnId] || [];

  const renderedCards = useMemo(() => {
    if (cards.length === 0) return null;

    return cards.map((card) => <CardItem key={card.id} card={card} />);
  }, [cards]);

  return renderedCards;
});

export default ColumnCards;
