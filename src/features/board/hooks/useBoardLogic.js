import { useCallback, useMemo } from "react";
import { useModal } from "@context/ModalContext";
import { useScreen } from "@context/ScreenContext";
import { useBoardContext } from "@board/context/BoardContext";
import { useBoardUI } from "@board/hooks/useBoardUI";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { useColumnHover } from "@board/hooks/useColumnHover";

export function useBoardLogic() {
    const {
        activeBoard,
        activeBoardColumns,
        cardsByColumn,
        handleAddCard: createCardData,
    } = useBoardContext();

    const { handleOpenCardModal, handleDeleteColumn } = useBoardUI();
    const { handleAddColumn } = useColumnModal({ activeBoard });
    const { isTouch } = useScreen();
    const { isModalOpen } = useModal();
    const { hoveredIndex, onEnter, onLeave } = useColumnHover();

    const onAddCard = useCallback(
        (columnId) => {
            const newCard = createCardData(columnId);
            if (newCard) handleOpenCardModal(newCard);
        },
        [createCardData, handleOpenCardModal]
    );

    const onCardClick = useCallback(
        (card) => {
            handleOpenCardModal({ ...card, columnId: card.displayColumnId });
        },
        [handleOpenCardModal]
    );

    const handleEditColumn = useCallback(
        (index, col) => handleAddColumn(index, col),
        [handleAddColumn]
    );

    const handleAddColumnAt = useCallback(
        (index, e) => {
            e?.stopPropagation();
            handleAddColumn(index);
        },
        [handleAddColumn]
    );

    const handleAddLastColumn = useCallback(() => {
        handleAddColumn(activeBoardColumns?.length || 0);
    }, [handleAddColumn, activeBoardColumns]);

    return useMemo(
        () => ({
            activeBoard,
            activeBoardColumns,
            cardsByColumn,
            isTouch,
            isModalOpen,
            hoveredIndex,
            onEnter,
            onLeave,
            handleAddColumnAt,
            onCardClick,
            onAddCard,
            handleEditColumn,
            handleDeleteColumn,
            handleAddLastColumn,
        }),
        [
            activeBoard,
            activeBoardColumns,
            cardsByColumn,
            isTouch,
            isModalOpen,
            hoveredIndex,
            onEnter,
            onLeave,
            handleAddColumnAt,
            onCardClick,
            onAddCard,
            handleEditColumn,
            handleDeleteColumn,
            handleAddLastColumn,
        ]
    );
}
