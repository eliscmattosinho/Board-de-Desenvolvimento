import React, { useState, useRef, useEffect } from "react";
import "./CardTask.css";
import { IoIosCloseCircleOutline, IoIosArrowDown } from "react-icons/io";
import { getDisplayStatus, columnIdToCanonicalStatus } from "../js/boardUtils";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function CardTask({ task, onClose, activeView, columns, moveTask, updateTask, deleteTask }) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const dropdownRef = useRef(null);

  // sync inputs with the received task
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setEditMode(false);
      setOpen(false);
    }
  }, [task]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!task) return null;

  const currentColumnId = columns.find(
    (col) => getDisplayStatus(task.status, activeView) === col.title
  )?.id;

  // change just the status
  const handleSelect = (colId) => {
    const canonicalStatus = columnIdToCanonicalStatus(colId);
    moveTask(task.id, canonicalStatus);
    setOpen(false);
  };

  // save updates (title/description)
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
    setEditMode(false);
  };

  const handleCancel = () => {
    // restore what came from the task
    setTitle(task.title || "");
    setDescription(task.description || "");
    setEditMode(false);
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    deleteTask(task.id);
    onClose();
    setShowConfirmDelete(false);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header-row">
          <h2>
            Card<span>#{task.id}</span>
          </h2>
        </div>

        {editMode ? (
          <div className="edit-section">
            <h3 className="card-title w-600">Título:</h3>
            <input
              className="input input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da tarefa"
            />
          </div>
        ) : (
          <h3 className="task-name">{task.title}</h3>
        )}

        <div className="info-content">
          <label className="status-label">
            <h3 className="card-title w-600">Status:</h3>
            <div className="custom-dropdown" ref={dropdownRef}>
              <div className="dropdown-selected" onClick={() => setOpen(!open)}>
                {columns.find((col) => col.id === currentColumnId)?.title || "Selecione"}
                <IoIosArrowDown size={15} className={`dropdown-icon ${open ? "open" : ""}`} />
              </div>
              {open && (
                <div className="dropdown-options">
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      className="dropdown-option"
                      onClick={() => handleSelect(col.id)}
                    >
                      {col.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>

          <div className="description-section">
            <h3 className="card-title w-600">Descrição:</h3>
            {editMode ? (
              <textarea
                className="input textarea-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição (opcional)"
                rows={4}
              />
            ) : (
              task.description || "Nenhuma descrição disponível."
            )}
          </div>

          <div className="modal-actions">
            {!editMode && (
              <button
                type="button"
                className="modal-btn btn-edit"
                onClick={() => setEditMode(true)}
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
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={onClose}
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
