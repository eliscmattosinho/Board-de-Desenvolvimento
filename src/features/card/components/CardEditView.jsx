import React from "react";

import StatusDropdown from "../../../components/StatusDropdown/StatusDropdown";

export default function CardEditView({ title, setTitle, description, setDescription, columns, currentColumnId, onSelect, isCreating }) {
    return (
        <div className={`modal-content card-edit ${isCreating ? "card-create" : ""}`}>
            <div className="modal-field title-block">
                <label className="input-title">Título:</label>
                <input
                    className="input-entry"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título da tarefa"
                />
            </div>

            <div className="status-block">
                <label className="input-title">Status:</label>
                <StatusDropdown columns={columns} currentColumnId={currentColumnId} onSelect={onSelect} />
            </div>

            <div className="modal-field">
                <label className="input-title">Descrição:</label>
                <textarea
                    className="input-entry textarea-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição (opcional)"
                    rows={4}
                />
            </div>
        </div>
    );
}
