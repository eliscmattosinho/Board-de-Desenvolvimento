import React, { useCallback, useMemo } from "react";
import { useModal } from "@/context/ModalContext";
import { useCardsContext } from "@card/context/CardContext";
import { useColumnsContext } from "@column/context/ColumnContext";
import { useBoardContext } from "@board/context/BoardContext";
import {
    showCustom,
    showSuccess,
    showWarning,
    dismissAll,
} from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";

export function useBoardUI() {
    const { openModal, closeModal } = useModal();
    const { moveCard, clearCards } = useCardsContext();
    const { removeColumn } = useColumnsContext();
    const {
        activeBoard,
        activeBoardColumns,
        getBoardsToClear,
        activeBoardCardCount,
    } = useBoardContext();

    const canClear = useMemo(
        () => (activeBoardCardCount ?? 0) > 0,
        [activeBoardCardCount]
    );

    const handleOpenCardModal = useCallback(
        (cardData) => {
            if (!cardData || !activeBoard) return;

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
        console.log("Tentando limpar board:", activeBoard);
        if (!activeBoard) return;

        if (!canClear) {
            showWarning("O board já está vazio!", { toastId: "board-empty" });
            return;
        }

        showCustom(
            ({ closeToast }) => (
                <ClearBoardToast
                    onConfirm={() => {
                        try {
                            const idsToClear = getBoardsToClear(activeBoard);
                            console.log("IDs para limpar:", idsToClear);

                            idsToClear.forEach((id) => clearCards(id));

                            closeToast();
                            showSuccess("Board limpo com sucesso!");
                        } catch (error) {
                            showWarning("Erro ao limpar o board.");
                            console.error(error);
                        }
                    }}
                    onCancel={closeToast}
                />
            ),
            { toastId: "confirm-clear", autoClose: false }
        );
    }, [activeBoard, getBoardsToClear, clearCards, canClear]);

    const handleDeleteColumn = useCallback(
        (col) => {
            if (!activeBoard || !col?.id) return;

            openModal(ConfirmDeleteModal, {
                type: "column",
                title: col.title,
                onConfirm: () => {
                    removeColumn(activeBoard, col.id);
                    showSuccess(`Coluna "${col.title}" excluída!`);
                    closeModal();
                },
                onCancel: closeModal,
            });
        },
        [openModal, closeModal, removeColumn, activeBoard]
    );

    return useMemo(
        () => ({
            handleOpenCardModal,
            handleClearBoard,
            handleDeleteColumn,
            canClear,
        }),
        [handleOpenCardModal, handleClearBoard, handleDeleteColumn, canClear]
    );
}
