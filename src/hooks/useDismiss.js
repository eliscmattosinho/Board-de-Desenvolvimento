import { useEffect } from "react";

export function useDismiss({ open, onClose, refs }) {
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (refs.some((r) => r.current?.contains(e.target))) return;
      onClose();
    };

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, refs]);
}
