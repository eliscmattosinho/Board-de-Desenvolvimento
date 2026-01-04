import React, { useRef, useState, useMemo, useCallback } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDismiss } from "@hooks/useDismiss";
import { useDropdownPosition } from "@hooks/useDropdownPosition";
import { StatusDropdownMenu } from "./StatusDropdownMenu";
import "./StatusDropdown.css";

export default function StatusDropdown({
  columns = [],
  currentColumnId,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const coords = useDropdownPosition(open, triggerRef);

  useDismiss({
    open,
    onClose: () => setOpen(false),
    refs: [triggerRef, menuRef],
  });

  const currentCol = useMemo(() => {
    if (!currentColumnId) return null;
    return columns?.find((col) => col.id === currentColumnId) ?? null;
  }, [columns, currentColumnId]);

  const circleStyle = {
    "--col-bg": currentCol?.style?.bg || "transparent",
    "--col-border": currentCol?.style?.border || "transparent",
  };

  const handleSelect = useCallback(
    (id) => {
      onSelect?.(id);
      setOpen(false);
    },
    [onSelect]
  );

  const toggleDropdown = () => setOpen((prev) => !prev);

  return (
    <>
      <div className="custom-dropdown w-600" ref={triggerRef}>
        <div
          className={`dropdown-selected ${open ? "open" : ""}`}
          onClick={toggleDropdown}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && toggleDropdown()}
        >
          <span className="col-circle" style={circleStyle} />
          <span className="status-value">
            {currentCol ? currentCol.title : "Selecione um status"}
          </span>
          <IoIosArrowDown
            size={15}
            className={`dropdown-icon ${open ? "open" : ""}`}
          />
        </div>
      </div>

      {open && (
        <StatusDropdownMenu
          columns={columns}
          coords={coords}
          menuRef={menuRef}
          onSelect={handleSelect}
        />
      )}
    </>
  );
}
