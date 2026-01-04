import { useCallback, useMemo } from "react";
import { showWarning } from "@utils/toastUtils";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";

export function useCardModalActions({
    card,
    activeBoard,
    columns,
    form,
    state,
    modal,
    cards,
    moveCard,
    dirty,
}) {
    const {
        title,
        setTitle,
        description,
        setDescription,
        columnId,
        setColumnId,
    } = form;

    const { isCreating, editMode, setEditMode, resetAnimation } = state;

    const handleSelect = useCallback(
        (nextColumnId) => {
            setColumnId(nextColumnId);
            // Se não estiver em modo de edição de texto, move o card no board
            if (!editMode) {
                moveCard(card.id, { boardId: activeBoard, columnId: nextColumnId });
            }
        },
        [setColumnId, editMode, moveCard, card.id, activeBoard]
    );

    const handleEdit = useCallback(() => setEditMode(true), [setEditMode]);

    const handleSave = useCallback(() => {
        const trimmedTitle = title.trim();

        // Validações com toastId
        if (!trimmedTitle) {
            return showWarning("O título não pode ficar vazio.", {
                toastId: "val-title",
            });
        }
        if (!columnId) {
            return showWarning("Escolha uma coluna.", {
                toastId: "val-col",
            });
        }

        // Se nada mudou, apenas sai do modo de edição
        if (!dirty) {
            setEditMode(false);
            return;
        }

        const payload = {
            title: trimmedTitle,
            description: description.trim(),
            columnId,
            boardId: activeBoard,
        };

        // Salva novo ou atualiza existente
        if (card.isNew) {
            cards.saveNewCard({ ...card, ...payload });
        } else {
            cards.updateCard(card.id, payload);
        }

        setEditMode(false);
        resetAnimation();
        modal.closeModal();
    }, [
        title,
        columnId,
        dirty,
        description,
        activeBoard,
        card,
        cards,
        setEditMode,
        resetAnimation,
        modal,
    ]);

    const handleCancel = useCallback(() => {
        // Restaura os valores originais vindos do card (Reset)
        setTitle(card.title || "");
        setDescription(card.description || "");
        setColumnId(card.columnId ?? columns?.[0]?.id ?? null);
        setEditMode(false);
    }, [card, columns, setTitle, setDescription, setColumnId, setEditMode]);

    const handleDelete = useCallback(() => {
        modal.openModal(ConfirmDeleteModal, {
            type: "card",
            onConfirm: () => {
                cards.deleteCard(card.id, activeBoard);
                modal.closeModal();
            },
            onCancel: modal.closeModal,
        });
    }, [modal, cards, card.id, activeBoard]);

    const handleClose = useCallback(() => {
        // Se for um card recém-criado e o usuário fechar sem digitar nada, removemos o "fantasma"
        const isEmpty = !title.trim() && !description.trim();

        if (isCreating && isEmpty) {
            cards.deleteCard(card.id, activeBoard);
        }

        resetAnimation();
        setEditMode(false);
        modal.closeModal();
    }, [
        isCreating,
        title,
        description,
        cards,
        card.id,
        activeBoard,
        resetAnimation,
        setEditMode,
        modal,
    ]);

    return useMemo(
        () => ({
            handleSelect,
            handleEdit,
            handleSave,
            handleCancel,
            handleDelete,
            handleClose,
        }),
        [
            handleSelect,
            handleEdit,
            handleSave,
            handleCancel,
            handleDelete,
            handleClose,
        ]
    );
}
