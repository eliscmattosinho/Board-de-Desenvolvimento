import React from "react";
import "./CardTask.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { getDisplayStatus, columnIdToCanonicalStatus } from "../js/boardUtils";

function CardTask({ task, onClose, activeView, columns, moveTask }) {
  if (!task) return null;

  const handleStatusChange = (e) => {
    const columnId = e.target.value;
    const canonicalStatus = columnIdToCanonicalStatus(columnId);
    moveTask(task.id, canonicalStatus);
  };

  const currentColumnId = columns.find(
    (col) => getDisplayStatus(task.status, activeView) === col.title
  )?.id;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          Card<span>#{task.id}</span>
        </h2>
        <h3>{task.title}</h3>
        <div className="info-content">
          <label>
            <strong>Status:</strong>
            <select value={currentColumnId} onChange={handleStatusChange}>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </label>
          <p>
            <strong>Descrição:</strong>{" "}
            {task.description || "Nenhuma descrição disponível."}
          </p>
        </div>
        <button className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline size={25} />
        </button>
      </div>
    </div>
  );
}

export default CardTask;
