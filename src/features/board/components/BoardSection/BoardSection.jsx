import React, { useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";
import BoardColumns from "@board/components/BoardColumns";
import { useBoardLogic } from "@board/hooks/useBoardLogic";
import "./BoardSection.css";

function BoardSection() {
  const containerRef = useRef(null);
  const { activeBoard, handleAddLastColumn } = useBoardLogic();

  return (
    <div
      ref={containerRef}
      className={`board-container ${activeBoard}-board active`}
    >
      <BoardColumns />

      <div className="col-add-last">
        <button
          className="add-col"
          onClick={handleAddLastColumn}
          aria-label="Criar nova coluna"
        >
          <CiCirclePlus className="plus-icon" size={30} />
        </button>
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default React.memo(BoardSection);
