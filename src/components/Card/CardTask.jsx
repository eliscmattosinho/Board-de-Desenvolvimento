import React, { useState } from "react";
import "./CardTask.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { columnIdToCanonicalStatus, getDisplayStatus } from "../../js/boardUtils";
import ConfirmDeleteModal from "./DeleteTaskModal/ConfirmDeleteModal";
import CardEdit from "./CardEdit";
import CardView from "./CardView";
import useTaskForm from "../../hooks/useTaskForm";
import CardContentSwitcher from "./CardContentSwitcher";
import CardActions from "./CardActions";

function CardTask({ task, onClose, activeView, columns, moveTask, updateTask, deleteTask }) {
  const isCreating = !!task?.isNew;
  const [editMode, setEditMode] = useState(isCreating);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { title, setTitle, description, setDescription, status, setStatus } = useTaskForm(task, columns, activeView);

  const currentColumnId = status;

  // Detecta alterações para habilitar botão Salvar
  React.useEffect(() => {
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
    if (editMode) {
      setStatus(colId);
    } else {
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

    // Atualiza a task e fecha o modal
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
    if (isCreating && !(title.trim() || description.trim())) {
      deleteTask(task.id);
    }
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
          className={`card-content-wrapper ${shouldAnimate ? "is-animating" : ""}`}
        >
          {isCreating ? (
            <div className="content-inner">
              <CardEdit
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                columns={columns}
                currentColumnId={currentColumnId}
                onSelect={handleSelect}
                mode="create"
              />
            </div>
          ) : (
            <CardContentSwitcher
              editMode={editMode}
              shouldAnimate={shouldAnimate}
              onAnimationEnd={() => setShouldAnimate(false)}
            >
              <CardEdit
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                columns={columns}
                currentColumnId={currentColumnId}
                onSelect={handleSelect}
                mode="edit"
              />
              <CardView
                task={task}
                columns={columns}
                currentColumnId={currentColumnId}
                onSelect={handleSelect}
              />
            </CardContentSwitcher>
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

export default CardTask;
