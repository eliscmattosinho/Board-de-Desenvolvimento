import React, { useState, useRef, useEffect } from "react";
import "./CardTask.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { getDisplayStatus, columnIdToCanonicalStatus } from "../../js/boardUtils";
import ConfirmDeleteModal from "./DeleteTaskModal/ConfirmDeleteModal";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import StatusDropdown from "../StatusDropdown";
import CardView from "./CardView";
import CardEdit from "./CardEdit";

function CardTask({ task, onClose, activeView, columns, moveTask, updateTask, deleteTask }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(""); // agora guarda o ID da coluna
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [dirty, setDirty] = useState(false);

  const contentRef = useRef(null);

  // Sincroniza inputs com a task recebida e reseta animação
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");

      // Define a coluna atual a partir do status canônico da task
      const currentColId = columns.find(
        (col) => getDisplayStatus(task.status, activeView) === col.title
      )?.id;
      setStatus(currentColId || "");

      setEditMode(false);
      setShouldAnimate(false);
      setDirty(false);
    }
  }, [task, columns, activeView]);

  // Recalcula se houve mudanças
  useEffect(() => {
    if (!editMode || !task) return;

    // Coluna original da task
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

  const currentColumnId = status; // agora status já é o colId

  const handleSelect = (colId) => {
    if (editMode) {
      // Apenas altera localmente no modo edição
      setStatus(colId);
    } else {
      // Move task no estado global no modo visualização
      const canonicalStatus = columnIdToCanonicalStatus(colId);
      moveTask(task.id, canonicalStatus);
    }
  };

  const handleEditClick = () => {
    setShouldAnimate(true);
    setEditMode(true);
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      alert("O título não pode ficar vazio.");
      return;
    }

    // Converte colId -> status canônico
    const canonicalStatus = columnIdToCanonicalStatus(status);

    // Confirma alterações no estado global
    updateTask(task.id, {
      title: trimmedTitle,
      description: trimmedDescription,
      status: canonicalStatus,
    });

    setShouldAnimate(true);
    setEditMode(false);
    setDirty(false);
  };

  const handleCancel = () => {
    // Reverte alterações locais
    setTitle(task.title || "");
    setDescription(task.description || "");
    const originalColId = columns.find(
      (col) => getDisplayStatus(task.status, activeView) === col.title
    )?.id;
    setStatus(originalColId || "");
    setShouldAnimate(true);
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
                className={`modal-btn btn-save ${dirty ? "active" : "disabled"}`}
                onClick={handleSave}
                disabled={!dirty}
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
