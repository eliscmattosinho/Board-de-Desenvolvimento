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
  const [editMode, setEditMode] = useState(task?.isNew || false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(""); // guarda o ID da coluna
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [dirty, setDirty] = useState(false);

  const contentRef = useRef(null);

  const isCreating = !!task?.isNew;

  // Sincroniza inputs com a task recebida e reseta animação
  useEffect(() => {
    if (!task) return;

    setTitle(task.title || "");
    setDescription(task.description || "");

    const currentColId = columns.find(
      (col) => getDisplayStatus(task.status, activeView) === col.title
    )?.id;
    setStatus(currentColId || columns[0]?.id || "");

    // Modo edição apenas para nova task não salva
    setEditMode(!!task.isNew);

    setShouldAnimate(false);
    setDirty(false);
  }, [task, columns, activeView]);

  // Verifica se houve alterações
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
      moveTask(task.id, columnIdToCanonicalStatus(colId));
    }
  };

  const handleEditClick = () => {
    setShouldAnimate(true);
    setEditMode(true);
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("O título não pode ficar vazio.");
      return;
    }

    const colIdToSave = status || columns[0]?.id;
    if (!colIdToSave) return;

    // Atualiza a task e fecha o modal
    updateTask(task.id, {
      title: trimmedTitle,
      description: description.trim(),
      status: columnIdToCanonicalStatus(colIdToSave),
      isNew: false,
    });
  };

  const handleCancel = () => {
    // Reverte alterações locais
    setTitle(task.title || "");
    setDescription(task.description || "");
    const originalColId = columns.find(
      (col) => getDisplayStatus(task.status, activeView) === col.title
    )?.id;

    setStatus(originalColId || columns[0]?.id || "");
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
    // Se estiver criando e sem conteúdo, exclui
    if (isCreating) {
      const hasContent = title.trim() || description.trim();
      if (!hasContent) {
        deleteTask(task.id);
      }
    }

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
                    mode={isCreating ? "create" : "edit"}
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
          {!editMode && !isCreating && (
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
              {!isCreating && (
                <button
                  type="button"
                  className="modal-btn btn-cancel"
                  onClick={handleCancel}
                  data-tooltip="Descartar edição"
                >
                  Cancelar
                </button>
              )}
            </>
          )}
          {!isCreating && (
            <button
              type="button"
              className="modal-btn btn-delete"
              onClick={handleDelete}
              data-tooltip="Excluir tarefa"
            >
              Excluir
            </button>
          )}
        </div>

        <button
          type="button"
          className="modal-close"
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
