import React from "react";
import "./CardTask.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { getDisplayStatus } from "../js/boardUtils";

function CardTask({ task, onClose, activeView }) {
  if (!task) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Card <span>#{task.id}</span></h2>
        <h3>{task.title}</h3>
        <div className="info-content">
          <p><strong>Status:</strong> {getDisplayStatus(task.status, activeView)}</p>
          <p><strong>Descrição:</strong> {task.description || "Nenhuma descrição disponível."}</p>
        </div>
        <button className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline size={25} />
        </button>
      </div>
    </div>
  );
}

export default CardTask;
