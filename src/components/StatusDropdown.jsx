import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function StatusDropdown({ columns, currentColumnId, onSelect }) {
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

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="dropdown-selected" onClick={() => setOpen(!open)}>
        {columns.find(col => col.id === currentColumnId)?.title || "Selecione"}
        <IoIosArrowDown size={15} className={`dropdown-icon ${open ? "open" : ""}`} />
      </div>
      {open && (
        <div className="dropdown-options">
          {columns.map(col => (
            <div key={col.id} className="dropdown-option" onClick={() => { onSelect(col.id); setOpen(false); }}>
              {col.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
