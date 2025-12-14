import { createPortal } from "react-dom";

export function StatusDropdownMenu({ columns, coords, menuRef, onSelect }) {
  if (!coords) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="dropdown-options-portal"
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        minWidth: coords.width,
        maxWidth: 150,
        minHeight: coords.height,
        zIndex: 2000,
      }}
      role="menu"
    >
      {columns.map((col) => {
        const styleVars = col.style || col.styleVars || {};
        return (
          <div
            key={col.id}
            className="dropdown-option w-600"
            role="menuitem"
            tabIndex={0}
            onClick={() => onSelect(col.id)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(col.id)}
            style={{
              "--col-bg": styleVars.bg,
              "--col-border": styleVars.border,
            }}
          >
            <span className="col-circle" />
            {col.title}
          </div>
        );
      })}
    </div>,
    document.body
  );
}
