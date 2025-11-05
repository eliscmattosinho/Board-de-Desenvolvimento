import React from "react";
import StatusDropdown from "../StatusDropdown";

export default function CardView({ task, columns, currentColumnId, onSelect }) {
  return (
    <div className="card-view">
      <h3 className="task-name w-600">{task.title}</h3>

      <div className="status-block">
        <label className="card-title w-600">Status:</label>
        <StatusDropdown
          columns={columns}
          currentColumnId={currentColumnId}
          onSelect={onSelect}
        />
      </div>

      <div className="description-section">
        <h3 className="card-title w-600">Descrição:</h3>
        {task.description || "Nenhuma descrição disponível."}
      </div>
    </div>
  );
}
