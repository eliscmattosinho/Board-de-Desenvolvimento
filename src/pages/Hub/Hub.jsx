import React from "react";
import "./Hub.css";

import BoardForm from "@board/components/BoardForm/BoardForm";

import { useHub } from "./hooks/useHub";
import HubActions from "./components/HubActions/HubActions";
import HubHeader from "./components/HubHeader/HubHeader";
import ActiveBoard from "./components/ActiveBoard/ActiveBoard";

export default function Hub() {
  const hub = useHub();

  const openNewBoardModal = () =>
    hub.openModal(BoardForm, { onConfirm: hub.createBoard });

  return (
    <main id="hub-container">
      <section className="hub-content">
        <HubActions
          onBack={() => hub.navigate("/")}
          onNewBoard={openNewBoardModal}
        />

        <HubHeader
          theme={hub.theme}
          activeBoard={hub.activeBoard}
          setActiveBoard={hub.setActiveBoard}
        />

        <ActiveBoard
          activeBoard={hub.activeBoard}
          columns={hub.columns?.[hub.activeBoard] ?? []}

          orderedCards={hub.orderedCards}
          commitDrop={hub.commitDrop}
          onPointerUp={hub.onPointerUp}

          title={hub.activeBoardTitle ?? "Board"}
          cardCount={hub.activeBoardCardCount ?? 0}
          handlers={{
            addCard: hub.handleAddCard,
            addColumn: hub.handleAddColumn,
            clear: hub.handleClearBoard,
            removeColumn: hub.removeColumn,
            onCardClick: hub.handleCardClick,
          }}
        />
      </section>
    </main>
  );
}
