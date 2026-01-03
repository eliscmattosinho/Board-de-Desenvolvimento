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

    const handleSelect = (nextColumnId) => {
        setColumnId(nextColumnId);
        // Se não estiver em editMode, move o card instantaneamente
        if (!editMode) {
            moveCard(card.id, { boardId: activeBoard, columnId: nextColumnId });
        }
    };

    const handleEdit = () => setEditMode(true);

    const handleSave = () => {
        // Validação de segurança extra no clique
        if (!title.trim()) return showWarning("O título não pode ficar vazio.");
        if (!columnId) return showWarning("Escolha uma coluna.");
        if (!dirty) return;

        const payload = {
            title: title.trim(),
            description: description.trim(),
            columnId,
            boardId: activeBoard,
        };

        card.isNew
            ? cards.saveNewCard({ ...card, ...payload })
            : cards.updateCard(card.id, payload);

        setEditMode(false);
        resetAnimation();
        modal.closeModal();
    };

    const handleCancel = () => {
        // Reset manual dos campos para o estado original do card
        setTitle(card.title || "");
        setDescription(card.description || "");
        setColumnId(card.columnId ?? columns?.[0]?.id ?? null);
        setEditMode(false);
    };

    const handleDelete = () => {
        modal.openModal(ConfirmDeleteModal, {
            type: "card",
            onConfirm: () => {
                cards.deleteCard(card.id, activeBoard);
                modal.closeModal();
            },
            onCancel: modal.closeModal,
        });
    };

    const handleClose = () => {
        // Se fechou um card novo sem conteúdo, remove o "fantasma"
        if (isCreating && !(title.trim() || description.trim())) {
            cards.deleteCard(card.id, activeBoard);
        }

        resetAnimation();
        setEditMode(false);
        modal.closeModal();
    };

    return {
        handleSelect,
        handleEdit,
        handleSave,
        handleCancel,
        handleDelete,
        handleClose,
    };
}
