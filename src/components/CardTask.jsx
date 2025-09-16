import React from "react";

function CardTask({ task, onClose }) {
    if (!task) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{task.title}</h2>

                <div className="info-content">
                    <p>
                        <strong>Status:</strong> {task.status}
                    </p>
                    <p>
                        <strong>Descrição:</strong>{" "}
                        {task.description || "Nenhuma descrição disponível."}
                    </p>
                </div>

                <button className="modal-close" onClick={onClose}>
                    X
                </button>
            </div>
        </div>
    );
}

export default CardTask;
