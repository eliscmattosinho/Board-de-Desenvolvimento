import React, { useState, useEffect, useCallback } from "react";
import { getTaskColumns } from "@board/components/templates/templateMirror";
import { getMirrorColumnId } from "@board/utils/boardSyncUtils";
import { showWarning } from "@utils/toastUtils";
import useTaskForm from "@card/hooks/useTaskForm.js";
import { useModal } from "@context/ModalContext";
import { useTasks } from "@task/context/TaskContext";

import Modal from "@components/Modal/Modal";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";
import CardEditView from "../CardEditView";
import CardTransition from "./CardTransition";
import CardActions from "./CardActions";

import "./CardModal.css";

export default function CardModal({ task, activeBoard, columns, moveTask }) {
    const isCreating = !!task?.isNew;

    const [editMode, setEditMode] = useState(isCreating);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [dirty, setDirty] = useState(false);

    const { title, setTitle, description, setDescription, status, setStatus } =
        useTaskForm(task, columns, activeBoard);

    const { openModal, closeModal } = useModal();
    const { saveNewTask, updateTask, deleteTask } = useTasks();

    const modalTitle = (
        <>
            Card <span className="task-id w-600">#{task.id}</span>
        </>
    );

    const getOriginalColumnId = useCallback(
        () => task?.columnId || columns[0]?.id || "",
        [task, columns]
    );

    useEffect(() => {
        if (!editMode || !task) return;

        const originalColId = getOriginalColumnId();
        const hasChanges =
            title.trim() !== (task.title || "").trim() ||
            description.trim() !== (task.description || "").trim() ||
            status !== originalColId;

        setDirty(hasChanges);
    }, [title, description, status, editMode, task, getOriginalColumnId]);

    if (!task) return null;

    const triggerAnimation = () => {
        setShouldAnimate(true);
        setIsAnimating(true);
    };

    const handleSelect = (colId) => {
        const { columnId: canonical } = getTaskColumns({
            status: columns.find(c => c.id === colId)?.title,
            boardId: activeBoard,
        });

        setStatus(colId);

        if (!editMode) {
            moveTask(task.id, {
                columnId: colId,
                mirroredColumnId: getMirrorColumnId(activeBoard, colId),
                status: canonical,
            });
        }
    };

    const handleEditClick = () => {
        triggerAnimation();
        setEditMode(true);
    };

    const handleSave = () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return showWarning("O título não pode ficar vazio.");
        if (!status) return showWarning("Escolha uma coluna antes de salvar.");

        const { columnId: canonicalStatus } = getTaskColumns({
            status: columns.find(c => c.id === status)?.title,
            boardId: activeBoard,
        });

        if (task.isNew) {
            saveNewTask({
                ...task,
                title: trimmedTitle,
                description: description.trim(),
                status: canonicalStatus,
                columnId: status,
                mirroredColumnId: getMirrorColumnId(activeBoard, status),
                boardId: activeBoard,
            });
        } else {
            updateTask(task.id, {
                title: trimmedTitle,
                description: description.trim(),
                status: canonicalStatus,
                columnId: status,
                mirroredColumnId: getMirrorColumnId(activeBoard, status),
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
        setStatus(isCreating ? "" : getOriginalColumnId());
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
        // Remove task temporária se não foi salva nem preenchida
        if (isCreating && !(title.trim() || description.trim())) {
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
            showHeader={true}
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
                        currentColumnId={status}
                        onSelect={handleSelect}
                        isCreating={true}
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
                        currentColumnId={status}
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
