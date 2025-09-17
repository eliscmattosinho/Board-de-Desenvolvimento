import React from "react";
import "./CardTask.css";
import { IoIosCloseCircleOutline } from "react-icons/io";

function CardTask({ task, onClose, statusMap }) {
    if (!task) return null;

    // Traduz o status canônico para o status exibido na view atual
    const displayStatus = statusMap ? statusMap[task.status] || task.status : task.status;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>
                    Card <span>#{task.id}</span>
                </h2>
                <h3>{task.title}</h3>

                <div className="info-content">
                    <p>
                        <strong>Status:</strong> {displayStatus}
                    </p>
                    <p>
                        <strong>Descrição:</strong>{" "}
                        {task.description || "Nenhuma descrição disponível."}
                    </p>
                </div>

                <button className="modal-close" onClick={onClose}>
                    <IoIosCloseCircleOutline size={25} className="close-icon" />
                </button>
            </div>
        </div>
    );
}

export default CardTask;
