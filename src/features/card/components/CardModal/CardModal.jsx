import React, { useMemo } from "react";
import { useModal } from "@context/ModalContext";
import { useCardsContext } from "@card/context/CardContext";
import { useDirtyCheck } from "@hooks/useDirtyCheck";
import useCardForm from "@card/hooks/useCardForm";
import Modal from "@components/Modal/Modal";
import CardForm from "@card/components/CardModal/CardForm";
import CardActions from "./CardActions";

import { useCardModalState } from "@card/hooks/useCardModalState";
import { useCardModalActions } from "@card/hooks/useCardModalActions";
import "./CardModal.css";

export default function CardModal({ card, activeBoard, columns, moveCard }) {
    if (!card) return null;

    const modal = useModal();
    const cards = useCardsContext();
    const state = useCardModalState(card);
    const form = useCardForm(card, columns);

    const dirty = useDirtyCheck(
        form.initialValues,
        {
            title: form.title,
            description: form.description,
            columnId: form.columnId,
        },
        form.isInitialized && (state.editMode || state.isCreating)
    );

    const canSave = useMemo(() => {
        const hasContent = form.title.trim().length > 0;
        return dirty && hasContent;
    }, [dirty, form.title]);

    const actions = useCardModalActions({
        card,
        activeBoard,
        columns,
        form,
        state,
        modal,
        cards,
        moveCard,
        dirty: canSave,
    });

    return (
        <Modal
            title={
                <>
                    Card <span className="card-id w-600">#{card.id}</span>
                </>
            }
            onClose={actions.handleClose}
            showHeader
            closeTooltip={state.isCreating ? "O card não será salvo" : "Fechar"}
        >
            <div
                className={`modal-content card-content-wrapper ${state.isAnimating ? "is-animating" : ""
                    }`}
            >
                <CardForm
                    form={form}
                    columns={columns}
                    onSelect={actions.handleSelect}
                    readOnly={!state.editMode}
                    isCreating={state.isCreating}
                    onTransitionStart={state.triggerAnimation}
                    onTransitionEnd={state.resetAnimation}
                />
            </div>

            <CardActions
                editMode={state.editMode || state.isCreating}
                isCreating={state.isCreating}
                dirty={canSave}
                onSave={actions.handleSave}
                onCancel={actions.handleCancel}
                onEdit={actions.handleEdit}
                onDelete={actions.handleDelete}
            />
        </Modal>
    );
}
