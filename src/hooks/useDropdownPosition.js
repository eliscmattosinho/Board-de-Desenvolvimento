import { useEffect, useState } from "react";

export function useDropdownPosition(open, triggerRef) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const update = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: Math.min(rect.width, 200),
        height: rect.height,
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, triggerRef]);

  return coords;
}
