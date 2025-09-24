import React, { useState, useRef, useEffect } from "react";
import "./CardTask.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { getDisplayStatus, columnIdToCanonicalStatus } from "../js/boardUtils";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import StatusDropdown from "./StatusDropdown";
import CardView from "./CardView";
import CardEdit from "./CardEdit";

function CardTask({ task, onClose, activeView, columns, moveTask, updateTask, deleteTask }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const contentRef = useRef(null);

  // Sincroniza inputs com a task recebida e reseta animação
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setEditMode(false);
      setShouldAnimate(false); // reset ao mudar de task
    }
  }, [task]);

  if (!task) return null;

  const currentColumnId = columns.find(
    (col) => getDisplayStatus(task.status, activeView) === col.title
  )?.id;

  const handleSelect = (colId) => {
    const canonicalStatus = columnIdToCanonicalStatus(colId);
    moveTask(task.id, canonicalStatus);
  };

  const handleEditClick = () => {
    setShouldAnimate(true);
    setEditMode(true);
  };

  const handleSave = () => {
    const trimmedTitle = (title || "").trim();
    const trimmedDescription = (description || "").trim();

    if (!trimmedTitle) {
      alert("O título não pode ficar vazio.");
      return;
    }

    updateTask(task.id, {
      title: trimmedTitle,
      description: trimmedDescription,
    });

    setShouldAnimate(true);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setShouldAnimate(true);
    setEditMode(false);
  };

  const handleDelete = () => setShowConfirmDelete(true);
  const confirmDelete = () => {
    deleteTask(task.id);
    handleClose();
    setShowConfirmDelete(false);
  };
  const cancelDelete = () => setShowConfirmDelete(false);

  const handleClose = () => {
    setShouldAnimate(false);
    setEditMode(false);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header-row">
          <h2>
            Card<span>#{task.id}</span>
          </h2>
        </div>

        <div className="card-content-wrapper">
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={editMode ? "edit" : "view"}
              nodeRef={contentRef}
              timeout={400}
              classNames="slide"
              in={shouldAnimate}
              onEntered={() => setShouldAnimate(false)}
            >
              <div className="content-inner" ref={contentRef}>
                {editMode ? (
                  <CardEdit
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    columns={columns}
                    currentColumnId={currentColumnId}
                    onSelect={handleSelect}
                  />
                ) : (
                  <CardView
                    task={task}
                    columns={columns}
                    currentColumnId={currentColumnId}
                    onSelect={handleSelect}
                  />
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>

        <div className="modal-actions">
          {!editMode && (
            <button
              type="button"
              className="modal-btn btn-edit"
              onClick={handleEditClick}
              data-tooltip="Editar tarefa"
            >
              Editar
            </button>
          )}
          {editMode && (
            <>
              <button
                type="button"
                className="modal-btn btn-save"
                onClick={handleSave}
                data-tooltip="Salvar alterações"
              >
                Salvar
              </button>
              <button
                type="button"
                className="modal-btn btn-cancel"
                onClick={handleCancel}
                data-tooltip="Descartar edição"
              >
                Cancelar
              </button>
            </>
          )}
          <button
            type="button"
            className="modal-btn btn-delete"
            onClick={handleDelete}
            data-tooltip="Excluir tarefa"
          >
            Excluir
          </button>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={handleClose}
          data-tooltip="Fechar"
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
