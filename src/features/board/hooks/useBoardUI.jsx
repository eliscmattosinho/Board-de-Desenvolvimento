import React, { useCallback } from "react";

import { useModal } from "@/context/ModalContext";

import { useCardsContext } from "@card/context/CardContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { useBoardContext } from "@board/context/BoardContext";

import { showCustom, showSuccess } from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";

export function useBoardUI() {
    const { openModal, closeModal } = useModal();
    const { moveCard, clearCards } = useCardsContext();
    const { removeColumn } = useColumnsContext();
    const { activeBoard, activeBoardColumns, getBoardsToClear } =
        useBoardContext();

    const handleOpenCardModal = useCallback(
        (cardData) => {
            if (!cardData) return;
            openModal(CardModal, {
                card: cardData,
                activeBoard,
                columns: activeBoardColumns,
                moveCard,
            });
        },
        [openModal, activeBoard, activeBoardColumns, moveCard]
    );

    const handleClearBoard = useCallback(() => {
        showCustom(({ closeToast }) => (
            <ClearBoardToast
                onConfirm={() => {
                    const idsToClear = getBoardsToClear(activeBoard);
                    idsToClear.forEach((id) => clearCards(id));
                    closeToast();
                    showSuccess("Board limpo com sucesso!");
                }}
                onCancel={closeToast}
            />
        ));
    }, [activeBoard, getBoardsToClear, clearCards]);

    const handleDeleteColumn = useCallback(
        (col) => {
            openModal(ConfirmDeleteModal, {
                type: "column",
                title: col.title,
                onConfirm: () => {
                    removeColumn(activeBoard, col.id);
                    showSuccess(`Coluna "${col.title}" foi excluída com sucesso!`);
                    closeModal();
                },
                onCancel: closeModal,
            });
        },
        [openModal, closeModal, removeColumn, activeBoard]
    );

    return { handleOpenCardModal, handleClearBoard, handleDeleteColumn };
}
