import React from "react";
import { createPortal } from "react-dom";

export function StatusDropdownMenu({ columns, coords, menuRef, onSelect }) {
  if (!coords || !columns) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="dropdown-options-portal"
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        minWidth: coords.width,
        maxWidth: 200,
        zIndex: 2000,
      }}
      role="listbox"
    >
      {columns.map((col) => {
        const s = col.style || col.styleVars || {};

        return (
          <div
            key={col.id}
            className="dropdown-option w-600"
            role="option"
            aria-selected={false}
            tabIndex={0}
            onClick={() => onSelect(col.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(col.id);
              }
            }}
            style={{
              "--col-bg": s.bg || "transparent",
              "--col-border": s.border || "transparent",
            }}
          >
            <span className="col-circle" />
            <span className="option-label">{col.title}</span>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
