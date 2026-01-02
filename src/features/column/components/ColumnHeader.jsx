import React, { useEffect, useRef } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import { useScreen } from "@context/ScreenContext";

const ColumnHeader = React.memo(
  ({ title, cardsLength, textColor, onEdit, onRemove }) => {
    const [hovered, setHovered] = React.useState(false);
    const { isTouch } = useScreen();
    const containerRef = useRef(null);

    useEffect(() => {
      if (!isTouch || !hovered) return;

      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setHovered(false);
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [hovered, isTouch]);

    return (
      <div
        ref={containerRef}
        className="col-title-container"
        onMouseEnter={() => !isTouch && setHovered(true)}
        onMouseLeave={() => !isTouch && setHovered(false)}
        onClick={() => isTouch && setHovered((prev) => !prev)}
      >
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
