import React, { useState, useEffect, useCallback } from "react";
import { showWarning } from "@utils/toastUtils";
import useCardForm from "@/features/card/hooks/useCardForm.js";
import { useModal } from "@context/ModalContext";
import { useCardsContext } from "@/features/card/context/CardContext";

import Modal from "@components/Modal/Modal";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";
import CardEditView from "../CardEditView";
import CardTransition from "./CardTransition";
import CardActions from "./CardActions";

import "./CardModal.css";

export default function CardModal({
    card,
    activeBoard,
    columns,
    moveCard,
}) {
    const isCreating = Boolean(card?.isNew);

    const [editMode, setEditMode] = useState(isCreating);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [dirty, setDirty] = useState(false);

    const {
        title,
        setTitle,
        description,
        setDescription,
        columnId,
        setColumnId,
    } = useCardForm(card, columns);

    const { openModal, closeModal } = useModal();
    const { saveNewCard, updateCard, deleteCard } = useCardsContext();

    const modalTitle = (
        <>
            Card <span className="card-id w-600">#{card.id}</span>
        </>
    );

    const getOriginalColumnId = useCallback(
        () => card?.columnId ?? columns[0]?.id ?? null,
        [card, columns]
    );

    // Detecta alterações locais para habilitar Save
    useEffect(() => {
        if (!editMode || !card) return;

        const originalColumnId = getOriginalColumnId();

        const hasChanges =
            title.trim() !== (card.title || "").trim() ||
            description.trim() !== (card.description || "").trim() ||
            columnId !== originalColumnId;

        setDirty(hasChanges);
    }, [
        title,
        description,
        columnId,
        editMode,
        card,
        getOriginalColumnId,
    ]);

    if (!card) return null;

    const triggerAnimation = () => {
        setShouldAnimate(true);
        setIsAnimating(true);
    };

    /**
     * Seleção de coluna:
     * - Atualiza estado local
     * - Se não estiver em edição, dispara MOVE_CARD
     */
    const handleSelect = (nextColumnId) => {
        setColumnId(nextColumnId);

        if (!editMode) {
            moveCard(card.id, {
                boardId: activeBoard,
                columnId: nextColumnId,
            });
        }
    };

    const handleEditClick = () => {
        triggerAnimation();
        setEditMode(true);
    };

    const handleSave = () => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            showWarning("O título não pode ficar vazio.");
            return;
        }

        if (!columnId) {
            showWarning("Escolha uma coluna antes de salvar.");
            return;
        }

        if (card.isNew) {
            saveNewCard({
                ...card,
                title: trimmedTitle,
                description: description.trim(),
                columnId,
                boardId: activeBoard,
            });
        } else {
            updateCard(card.id, {
                title: trimmedTitle,
                description: description.trim(),
                columnId,
            });
        }

        setEditMode(false);
        setDirty(false);
        handleClose();
    };

    const handleCancel = () => {
        triggerAnimation();
        setTitle(card.title || "");
        setDescription(card.description || "");
        setColumnId(
            isCreating
                ? columns?.[0]?.id ?? null
                : getOriginalColumnId()
        );
        setEditMode(false);
        setDirty(false);
    };

    const handleDelete = () => {
        openModal(ConfirmDeleteModal, {
            type: "card",
            onConfirm: () => {
                deleteCard(card.id, activeBoard);
                closeModal();
                handleClose();
            },
            onCancel: closeModal,
        });
    };

    const handleClose = () => {
        /**
         * Remove card temporária se:
         * - está criando
         * - não salvou
         * - não digitou nada
         */
        if (
            isCreating &&
            !(title.trim() || description.trim())
        ) {
            deleteCard(card.id, activeBoard);
        }

        setEditMode(false);
        setShouldAnimate(false);
        setIsAnimating(false);
        closeModal();
    };

    return (
        <Modal
            title={modalTitle}
            onClose={handleClose}
            showHeader
            closeTooltip={isCreating ? "O card não será salvo" : "Fechar"}
        >
            <div
                className={`modal-content create-card-modal card-content-wrapper ${isAnimating ? "is-animating" : ""
                    }`}
            >
                {isCreating ? (
                    <CardEditView
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        columns={columns}
                        currentColumnId={columnId}
                        onSelect={handleSelect}
                        isCreating
                    />
                ) : (
                    <CardTransition
                        editMode={editMode}
                        shouldAnimate={shouldAnimate}
                        onAnimationEnd={() => {
                            setShouldAnimate(false);
                            setIsAnimating(false);
                        }}
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        columns={columns}
                        currentColumnId={columnId}
                        onSelect={handleSelect}
                    />
                )}
            </div>

            <CardActions
                editMode={isCreating || editMode}
                isCreating={isCreating}
                dirty={dirty}
                onSave={handleSave}
                onCancel={handleCancel}
                onEdit={handleEditClick}
                onDelete={handleDelete}
            />
        </Modal>
    );
}
