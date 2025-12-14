import React, { useState, useEffect, useCallback } from "react";
import { showWarning } from "@utils/toastUtils";
import useTaskForm from "@card/hooks/useTaskForm.js";
import { useModal } from "@context/ModalContext";
import { useTasksContext } from "@task/context/TaskContext";

import Modal from "@components/Modal/Modal";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";
import CardEditView from "../CardEditView";
import CardTransition from "./CardTransition";
import CardActions from "./CardActions";

import "./CardModal.css";

export default function CardModal({
    task,
    activeBoard,
    columns,
    moveTask,
}) {
    const isCreating = Boolean(task?.isNew);

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
    } = useTaskForm(task, columns);

    const { openModal, closeModal } = useModal();
    const { saveNewTask, updateTask, deleteTask } = useTasksContext();

    const modalTitle = (
        <>
            Card <span className="task-id w-600">#{task.id}</span>
        </>
    );

    const getOriginalColumnId = useCallback(
        () => task?.columnId ?? columns[0]?.id ?? null,
        [task, columns]
    );

    // Detecta alterações locais para habilitar Save
    useEffect(() => {
        if (!editMode || !task) return;

        const originalColumnId = getOriginalColumnId();

        const hasChanges =
            title.trim() !== (task.title || "").trim() ||
            description.trim() !== (task.description || "").trim() ||
            columnId !== originalColumnId;

        setDirty(hasChanges);
    }, [
        title,
        description,
        columnId,
        editMode,
        task,
        getOriginalColumnId,
    ]);

    if (!task) return null;

    const triggerAnimation = () => {
        setShouldAnimate(true);
        setIsAnimating(true);
    };

    /**
     * Seleção de coluna:
     * - Atualiza estado local
     * - Se não estiver em edição, dispara MOVE_TASK
     */
    const handleSelect = (nextColumnId) => {
        setColumnId(nextColumnId);

        if (!editMode) {
            moveTask(task.id, {
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

        if (task.isNew) {
            saveNewTask({
                ...task,
                title: trimmedTitle,
                description: description.trim(),
                columnId,
                boardId: activeBoard,
            });
        } else {
            updateTask(task.id, {
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
        setTitle(task.title || "");
        setDescription(task.description || "");
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
            type: "task",
            onConfirm: () => {
                deleteTask(task.id, activeBoard);
                closeModal();
                handleClose();
            },
            onCancel: closeModal,
        });
    };

    const handleClose = () => {
        /**
         * Remove task temporária se:
         * - está criando
         * - não salvou
         * - não digitou nada
         */
        if (
            isCreating &&
            !(title.trim() || description.trim())
        ) {
            deleteTask(task.id, activeBoard);
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
                className={`modal-content create-task-modal card-content-wrapper ${isAnimating ? "is-animating" : ""
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
