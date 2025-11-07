import React from "react";
import PropTypes from "prop-types";
import styles from "./ClearBoardToast.module.css";

const ClearBoardToast = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.toastConfirmContent}>
      <p className={styles.toastText}>
        Tem certeza de que deseja limpar todas as tarefas deste board?
      </p>

      <div className={styles.toastConfirmContainer}>
        <button
          className={`${styles.toastBtn} ${styles.toastBtnConfirm}`}
          onClick={onConfirm}
        >
          Sim, limpar
        </button>

        <button
          className={`${styles.toastBtn} ${styles.toastBtnCancel}`}
          onClick={onCancel}
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
