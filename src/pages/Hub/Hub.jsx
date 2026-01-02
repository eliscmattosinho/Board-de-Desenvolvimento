import React from "react";
import "./Hub.css";

import BoardForm from "@board/components/BoardForm/BoardForm";
import { useModal } from "@context/ModalContext";
import { useHub } from "./hooks/useHub";
import HubActions from "./components/HubActions/HubActions";
import HubHeader from "./components/HubHeader/HubHeader";
import ActiveBoard from "./components/ActiveBoard/ActiveBoard";

export default function Hub() {
  const hub = useHub();
  const { openModal } = useModal();

  const openNewBoardModal = () =>
    openModal(BoardForm, {
      onConfirm: (boardData) => {
        hub.createBoard(boardData);
      },
    });

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

        <ActiveBoard />
      </section>
    </main>
  );
}
