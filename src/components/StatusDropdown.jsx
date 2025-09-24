import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoIosArrowDown } from "react-icons/io";

export default function StatusDropdown({ columns, currentColumnId, onSelect }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

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
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: Math.max(rect.width, 120),
    });

    const handleReposition = () => {
      const r = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: r.bottom + window.scrollY,
        left: r.left + window.scrollX,
        width: Math.max(r.width, 120),
      });
    };

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const menu = open ? createPortal(
    <div
      ref={menuRef}
      className="dropdown-options-portal"
      style={{
        position: "absolute",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        minWidth: `${coords.width}px`,
        zIndex: 2000 /* > modal -index (1000) */
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
