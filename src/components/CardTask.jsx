import React, { useState, useRef, useEffect } from "react";
import "./CardTask.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { getDisplayStatus, columnIdToCanonicalStatus } from "../js/boardUtils";

function CardTask({ task, onClose, activeView, columns, moveTask }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!task) return null;

  const currentColumnId = columns.find(
    (col) => getDisplayStatus(task.status, activeView) === col.title
  )?.id;

  const handleSelect = (colId) => {
    const canonicalStatus = columnIdToCanonicalStatus(colId);
    moveTask(task.id, canonicalStatus);
    setOpen(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          Card<span>#{task.id}</span>
        </h2>
        <h3>{task.title}</h3>
        <div className="info-content">
          <label className="status-label">
            <strong>Status:</strong>
            <div className="custom-dropdown" ref={dropdownRef}>
              <div className="dropdown-selected" onClick={() => setOpen(!open)}>
                {columns.find(col => col.id === currentColumnId)?.title || "Selecione"}
                <IoIosArrowDown size={15} className={`dropdown-icon ${open ? "open" : ""}`} />
              </div>
              {open && (
                <div className="dropdown-options">
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      className="dropdown-option"
                      onClick={() => handleSelect(col.id)}
                    >
                      {col.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
          <p>
            <strong>Descrição:</strong>{" "}
            {task.description || "Nenhuma descrição disponível."}
          </p>
        </div>
        <button className="modal-close" onClick={onClose}>
          <IoIosCloseCircleOutline size={25} />
        </button>
      </div>
    </div>
  );
}

export default CardTask;
