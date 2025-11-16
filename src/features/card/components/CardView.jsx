import React from "react";

import StatusDropdown from "@components/StatusDropdown/StatusDropdown";

export default function CardView({ title, description, columns, currentColumnId, onSelect }) {
    return (
        <div className="modal-content view-task-modal card-view">
            <h2 className="task-name">{title}</h2>
            <div className="status-block">
                <label className="input-title">Status:</label>
                <StatusDropdown columns={columns} currentColumnId={currentColumnId} onSelect={onSelect} />
            </div>
            <div className="description-section">
                <h3 className="input-title">Descrição:</h3>
                <p className="description-text">{description || "Nenhuma descrição disponível."}</p>
            </div>
        </div>
    );
}
