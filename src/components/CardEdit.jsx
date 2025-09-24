import React from "react";
import StatusDropdown from "./StatusDropdown";

export default function CardEdit({ title, setTitle, description, setDescription, columns, currentColumnId, onSelect }) {
  return (
    <div className="card-edit">
      <div className="title-block">
        <label className="card-title w-600">Título:</label>
        <input
          className="input input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da tarefa"
        />
      </div>

      <div className="status-block">
        <label className="card-title w-600">Status:</label>
        <StatusDropdown columns={columns} currentColumnId={currentColumnId} onSelect={onSelect} />
      </div>

      <div className="description-block">
        <label className="card-title w-600">Descrição:</label>
        <textarea
          className="input textarea-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          rows={4}
        />
      </div>
    </div>
  );
}
