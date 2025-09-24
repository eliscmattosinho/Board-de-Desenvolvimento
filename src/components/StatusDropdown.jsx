import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoIosArrowDown } from "react-icons/io";

export default function StatusDropdown({ columns, currentColumnId, onSelect }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState(null); // null indica que ainda não calculou

  // close when clicked outside / press Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => { if (e.key === "Escape") setOpen(false); };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // calc position when open
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 120),
      });
    };

    updatePosition(); // initial position
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  // Só renderiza o portal quando open e coords calculadas
  const menu = open && coords ? createPortal(
    <div
      ref={menuRef}
      className="dropdown-options-portal"
      style={{
        position: "absolute",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        minWidth: `${coords.width}px`,
        zIndex: 2000
      }}
      role="menu"
    >
      {columns.map((col) => (
        <div
          key={col.id}
          className="dropdown-option"
          role="menuitem"
          tabIndex={0}
          onClick={() => { onSelect(col.id); setOpen(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") { onSelect(col.id); setOpen(false); } }}
        >
          {col.title}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className="custom-dropdown" ref={triggerRef}>
        <div
          className="dropdown-selected"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          {columns.find(col => col.id === currentColumnId)?.title || "Selecione"}
          <IoIosArrowDown size={15} className={`dropdown-icon ${open ? "open" : ""}`} />
        </div>
      </div>
      {menu}
    </>
  );
}
