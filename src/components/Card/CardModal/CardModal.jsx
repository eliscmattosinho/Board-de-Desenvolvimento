import React, { useState, useEffect, useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import StatusDropdown from "../../StatusDropdown";
import ConfirmDeleteModal from "../DeleteTaskModal/ConfirmDeleteModal";
import { columnIdToCanonicalStatus, getDisplayStatus } from "../../../js/boardUtils";
import useTaskForm from "../../../hooks/useTaskForm";
import "./CardModal.css";

export default function CardModal({ task, onClose, activeView, columns, moveTask, updateTask, deleteTask }) {
    const isCreating = !!task?.isNew;

    const [editMode, setEditMode] = useState(isCreating);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const { title, setTitle, description, setDescription, status, setStatus } = useTaskForm(task, columns, activeView);
    const currentColumnId = status;

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

    const handleSelect = (colId) => {
        if (editMode) setStatus(colId);
        else {
            moveTask(task.id, columnIdToCanonicalStatus(colId));
            setStatus(colId);
        }
    };

    const handleEditClick = () => {
        setShouldAnimate(true);
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

        setEditMode(false);
        setDirty(false);
    };

    const handleCancel = () => {
        setTitle(task.title || "");
        setDescription(task.description || "");
        const originalColId = columns.find(
            (col) => getDisplayStatus(task.status, activeView) === col.title
        )?.id;
        setStatus(originalColId || columns[0]?.id || "");
        setEditMode(false);
        setDirty(false);
        setShouldAnimate(true);
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
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header-row">
                    <h2 className="w-600">Card<span>#{task.id}</span></h2>
                </div>

                <div
                    className="card-content-wrapper"
                    style={{ overflow: shouldAnimate ? "hidden" : "visible" }}
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
                            onAnimationEnd={() => setShouldAnimate(false)}
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

function CardEditView({ title, setTitle, description, setDescription, columns, currentColumnId, onSelect, isCreating }) {
    return (
        <div className={`card-edit ${isCreating ? "card-create" : ""}`}>
            <div className="title-block">
                <label className="card-title w-600">Título:</label>
                <input
                    className="input input-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título da tarefa"
                />
            </div>

            <div className="status-block">
                <label className="card-title w-600">Status:</label>
                <StatusDropdown columns={columns} currentColumnId={currentColumnId} onSelect={onSelect} />
            </div>

            <div className="description-block">
                <label className="card-title w-600">Descrição:</label>
                <textarea
                    className="input textarea-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição (opcional)"
                    rows={4}
                />
            </div>
        </div>
    );
}

function CardTransition({ editMode, shouldAnimate, onAnimationEnd, title, setTitle, description, setDescription, columns, currentColumnId, onSelect }) {
    const contentRef = useRef(null);

    const EditView = (
        <CardEditView
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            columns={columns}
            currentColumnId={currentColumnId}
        />
    );

    const View = (
        <div className="card-view">
            <h3 className="task-name w-600">{title}</h3>
            <div className="status-block">
                <label className="card-title w-600">Status:</label>
                <StatusDropdown columns={columns} currentColumnId={currentColumnId} onSelect={onSelect} />
            </div>
            <div className="description-section">
                <h3 className="card-title w-600">Descrição:</h3>
                {description || "Nenhuma descrição disponível."}
            </div>
        </div>
    );

    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={editMode ? "edit" : "view"}
                nodeRef={contentRef}
                timeout={400}
                classNames="slide"
                in={shouldAnimate}
                onEntered={onAnimationEnd}
            >
                <div className="content-inner" ref={contentRef}>
                    {editMode ? EditView : View}
                </div>
            </CSSTransition>
        </SwitchTransition>
    );
}

function CardActions({ editMode, isCreating, dirty, onSave, onCancel, onEdit, onDelete }) {
    return (
        <div className="modal-actions">
            {!editMode && !isCreating && (
                <button type="button" className="modal-btn btn-edit" onClick={onEdit} data-tooltip="Editar tarefa">
                    Editar
                </button>
            )}

            {editMode && (
                <>
                    <button
                        type="button"
                        className={`modal-btn btn-save ${dirty || isCreating ? "active" : "disabled"}`}
                        onClick={onSave}
                        disabled={!dirty && !isCreating}
                        data-tooltip="Salvar alterações"
                    >
                        Salvar
                    </button>

                    {!isCreating && (
                        <button type="button" className="modal-btn btn-cancel" onClick={onCancel} data-tooltip="Descartar edição">
                            Cancelar
                        </button>
                    )}
                </>
            )}

            {!isCreating && (
                <button type="button" className="modal-btn btn-delete" onClick={onDelete} data-tooltip="Excluir tarefa">
                    Excluir
                </button>
            )}
        </div>
    );
}
