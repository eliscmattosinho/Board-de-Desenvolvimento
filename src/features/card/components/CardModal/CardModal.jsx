import React from "react";
import { useModal } from "@context/ModalContext";
import { useCardsContext } from "@card/context/CardContext";
import useCardForm from "@card/hooks/useCardForm";

import Modal from "@components/Modal/Modal";
import CardContent from "@card/components/CardContent";
import CardActions from "./CardActions";

import { useCardModalState } from "@card/hooks/useCardModalState";
import { useCardDirtyCheck } from "@card/hooks/useCardDirtyCheck";
import { useCardModalActions } from "@card/hooks/useCardModalActions";

import "./CardModal.css";

export default function CardModal({ card, activeBoard, columns, moveCard }) {
    if (!card) return null;

    const modal = useModal();
    const cards = useCardsContext();
    const form = useCardForm(card, columns);
    const state = useCardModalState(card);

    const dirty = useCardDirtyCheck({
        card,
        columns,
        editMode: state.editMode,
        ...form,
    });

    const actions = useCardModalActions({
        card,
        activeBoard,
        columns,
        form,
        state,
        modal,
        cards,
        moveCard,
        dirty,
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
                <CardContent
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
                dirty={dirty}
                onSave={actions.handleSave}
                onCancel={actions.handleCancel}
                onEdit={actions.handleEdit}
                onDelete={actions.handleDelete}
            />
        </Modal>
    );
}
