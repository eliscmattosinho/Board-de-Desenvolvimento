import React from "react";
import PropTypes from "prop-types";
import styles from "./ClearBoardToast.module.css";

const ClearBoardToast = ({ onConfirm, onCancel }) => {
  return (
    <div
      className={styles.toastConfirmContent}
      role="alertdialog"
      aria-labelledby="confirmation-title"
    >
      <p id="confirmation-title" className={styles.toastText}>
        Tem certeza de que deseja limpar todas as tarefas deste board?
      </p>

      <div className={styles.toastConfirmContainer}>
        <button
          type="button"
          className={`${styles.toastBtn} ${styles.toastBtnConfirm}`}
          onClick={onConfirm}
          aria-label="Confirmar limpeza do board"
        >
          Sim, limpar
        </button>

        <button
          type="button"
          className={`${styles.toastBtn} ${styles.toastBtnCancel}`}
          onClick={onCancel}
          aria-label="Cancelar limpeza"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

ClearBoardToast.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ClearBoardToast;
