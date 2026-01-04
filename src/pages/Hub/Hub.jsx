import React from "react";
import "./Hub.css";

import { useModal } from "@context/ModalContext";
import { useHub } from "./hooks/useHub";

import HubActions from "./components/HubActions";
import BoardForm from "@board/components/BoardForm/BoardForm";
import HubHeader from "./components/HubHeader";
import ActiveBoard from "./components/ActiveBoard";

export default function Hub() {
  const { navigate, createBoard } = useHub();
  const { openModal } = useModal();

  const openNewBoardModal = () =>
    openModal(BoardForm, {
      onConfirm: (boardData) => {
        createBoard(boardData);
      },
    });

  return (
    <main id="hub-container">
      <section className="hub-content">
        <HubActions
          onBack={() => navigate("/")}
          onNewBoard={openNewBoardModal}
        />

        <HubHeader />

        <ActiveBoard />
      </section>
    </main>
  );
}
