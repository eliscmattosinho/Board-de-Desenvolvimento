import React from "react";
import { toast } from "react-toastify";
import "./ClearBoardToast.css";

const ClearBoardToast = ({ onConfirm, onCancel }) => {
  return (
    <div className="toast-confirm-content">
      <p className="toast-p">Tem certeza de que deseja limpar todas as tarefas deste board?</p>
      <div className="toast-confirm-container">
        <button
          className="toast-btn toast-btn-confirm"
          onClick={() => {
            onConfirm();
            toast.dismiss();
            toast.success("Todas as tarefas foram removidas com sucesso!", {
              closeButton: false,
            });
          }}
        >
          Sim, limpar
        </button>

        <button className="toast-btn toast-btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ClearBoardToast;
