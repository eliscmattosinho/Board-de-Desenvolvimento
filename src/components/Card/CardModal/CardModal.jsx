import React, { useState, useEffect } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import ConfirmDeleteModal from "../DeleteTaskModal/ConfirmDeleteModal";
import { columnIdToCanonicalStatus, getDisplayStatus } from "../../../js/boardUtils";
import useTaskForm from "../../../hooks/useTaskForm";

import CardEditView from "./CardEditView";
import CardTransition from "./CardTransition";
import CardActions from "./CardActions";
import "./CardModal.css";

export default function CardModal({ task, onClose, activeView, columns, moveTask, updateTask, deleteTask }) {
    const isCreating = !!task?.isNew;

    const [editMode, setEditMode] = useState(isCreating);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const { title, setTitle, description, setDescription, status, setStatus } = useTaskForm(task, columns, activeView);
    const currentColumnId = status;

    // Detecta alterações nos campos para marcar dirty
    useEffect(() => {
        if (!editMode || !task) return;

        const originalColId = columns.find(
            (col) => getDisplayStatus(task.status, activeView) === col.title
        )?.id;

        const hasChanges =
            title.trim() !== (task.title || "").trim() ||
            description.trim() !== (task.description || "").trim() ||
            status !== originalColId;

        setDirty(hasChanges);
    }, [title, description, status, editMode, task, columns, activeView]);

    if (!task) return null;

    const triggerAnimation = () => {
        setShouldAnimate(true);
        setIsAnimating(true);
    };

    const handleSelect = (colId) => {
        if (editMode) setStatus(colId);
        else {
            moveTask(task.id, columnIdToCanonicalStatus(colId));
            setStatus(colId);
        }
    };

    const handleEditClick = () => {
        triggerAnimation();
        setEditMode(true);
    };

    const handleSave = () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return alert("O título não pode ficar vazio.");

        const colIdToSave = status || columns[0]?.id;
        if (!colIdToSave) return;

        updateTask(task.id, {
            title: trimmedTitle,
            description: description.trim(),
            status: columnIdToCanonicalStatus(colIdToSave),
            isNew: false,
        });

        triggerAnimation();
        setEditMode(false);
        setDirty(false);
    };

    const handleCancel = () => {
        triggerAnimation();
        setTitle(task.title || "");
        setDescription(task.description || "");
        const originalColId = columns.find(
            (col) => getDisplayStatus(task.status, activeView) === col.title
        )?.id;
        setStatus(originalColId || columns[0]?.id || "");
        setEditMode(false);
        setDirty(false);
    };

    const handleDelete = () => setShowConfirmDelete(true);
    const confirmDelete = () => {
        deleteTask(task.id);
        handleClose();
        setShowConfirmDelete(false);
    };
    const cancelDelete = () => setShowConfirmDelete(false);

    const handleClose = () => {
        if (isCreating && !(title.trim() || description.trim())) deleteTask(task.id);
        setEditMode(false);
        setShouldAnimate(false);
        setIsAnimating(false);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header-row">
                    <h2 className="w-600">
                        Card<span>#{task.id}</span>
                    </h2>
                </div>

                <div
                    className={`card-content-wrapper ${isAnimating ? "is-animating" : ""}`}
                >
                    {isCreating ? (
                        <CardEditView
                            title={title}
                            setTitle={setTitle}
                            description={description}
                            setDescription={setDescription}
                            columns={columns}
                            currentColumnId={currentColumnId}
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
                            currentColumnId={currentColumnId}
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

                <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                    data-tooltip={isCreating ? "O card não será salvo" : "Fechar"}
                >
                    <IoIosCloseCircleOutline size={25} />
                </button>
            </div>

            <ConfirmDeleteModal
                isOpen={showConfirmDelete}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}
