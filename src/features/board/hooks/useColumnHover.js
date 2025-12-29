import { useState, useCallback } from "react";

export function useColumnHover() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const onEnter = useCallback((index) => {
    setHoveredIndex(index);
  }, []);

  const onLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return { hoveredIndex, onEnter, onLeave };
}
