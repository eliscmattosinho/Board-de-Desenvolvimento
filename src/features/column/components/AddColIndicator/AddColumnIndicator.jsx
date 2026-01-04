import React, { useCallback } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useBoardLogic } from "@board/hooks/useBoardLogic";
import "./AddColumnIndicator.css";

function AddColumnIndicator({ indexAt }) {
  const { handleAddColumnAt, isModalOpen } = useBoardLogic();

  const handleClick = useCallback(
    (e) => {
      // indexAt + 1 porque o indicador está "entre" colunas
      handleAddColumnAt(indexAt + 1, e);
    },
    [indexAt, handleAddColumnAt]
  );

  return (
    <div className={`add-col-container ${isModalOpen ? "blocked" : ""}`}>
      <span className="col-line line-top"></span>

      <button
        className="add-col-button"
        onClick={handleClick}
        disabled={isModalOpen}
        type="button"
      >
        <CiCirclePlus
          className="plus-icon"
          size={30}
          data-tooltip={isModalOpen ? "Bloqueado" : "Adicionar coluna"}
        />
      </button>

      <span className="col-line line-bottom"></span>
    </div>
  );
}

export default React.memo(AddColumnIndicator);
