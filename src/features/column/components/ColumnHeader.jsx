import React from "react";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import { useScreen } from "@context/ScreenContext";
import { useColHeader } from "@column/hooks/useColHeader";

const ColumnHeader = React.memo(
  ({ title, cardsLength, textColor, onEdit, onRemove }) => {
    const { isTouch } = useScreen();
    const { hovered, hoverProps } = useColHeader(isTouch);

    return (
      <div className="col-title-container" {...hoverProps}>
        <div className="col-title-content">
          {onRemove && (
            <button
              className={`board-icon col-icon-left trash-icon ${hovered ? "visible" : ""
                }`}
              onClick={onRemove}
              data-tooltip="Excluir coluna"
            >
              <IoTrashOutline size={20} />
            </button>
          )}

          <p
            className={`col-title-board ${hovered ? "shrink" : ""}`}
            style={{ color: textColor }}
          >
            {title}
            <span className="card-counter">({cardsLength})</span>
          </p>

          {onEdit && (
            <button
              className={`board-icon col-icon-right edit-icon ${hovered ? "visible" : ""
                }`}
              onClick={onEdit}
              data-tooltip="Editar coluna"
            >
              <AiOutlineEdit size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default ColumnHeader;
