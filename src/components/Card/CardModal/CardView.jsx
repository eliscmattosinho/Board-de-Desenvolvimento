import React from "react";
import StatusDropdown from "../../StatusDropdown";

export default function CardView({ title, description, columns, currentColumnId, onSelect }) {
    return (
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
}
