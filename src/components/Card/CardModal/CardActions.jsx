import React from "react";

export default function CardActions({ editMode, isCreating, dirty, onSave, onCancel, onEdit, onDelete }) {
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
