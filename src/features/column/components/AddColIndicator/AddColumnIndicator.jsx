import React, { useCallback } from "react";
import { CiCirclePlus } from "react-icons/ci";
import "./AddColumnIndicator.css";

function AddColumnIndicator({ onClick, isBlocked }) {
  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isBlocked && onClick) {
        onClick(e);
      }
    },
    [onClick, isBlocked]
  );

  return (
    <div className={`add-col-container ${isBlocked ? "blocked" : ""}`}>
      <span className="col-line line-top"></span>

      <button
        className="add-col-button"
        onClick={handleClick}
        disabled={isBlocked}
        aria-label="Adicionar coluna"
        type="button"
      >
        <CiCirclePlus
          className="plus-icon"
          size={30}
          data-tooltip={isBlocked ? "Ação bloqueada" : "Adicionar coluna"}
        />
      </button>

      <span className="col-line line-bottom"></span>
    </div>
  );
}

export default React.memo(AddColumnIndicator);
