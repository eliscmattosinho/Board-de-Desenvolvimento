import React, { createContext, useContext, useRef, useCallback } from "react";
import { useGesture } from "./GestureContext";

const BoardPanContext = createContext(null);

export function BoardPanProvider({ children }) {
  const { stateRef } = useGesture();

  const velocity = useRef(0);
  const lastX = useRef(0);

  const start = useCallback((e, container) => {
    lastX.current = e.clientX;
    container.classList.add("panning");
  }, []);

  const onMove = useCallback(
    (e, container) => {
      if (stateRef.current.mode !== "pan") return;

      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;

      velocity.current = dx;
      container.scrollLeft -= dx;
    },
    [stateRef]
  );

  const end = useCallback((container) => {
    if (!container) return;

    container.classList.remove("panning");

    if (stateRef.current.mode !== "pan") return;

    const step = () => {
      velocity.current *= 0.92;
      if (Math.abs(velocity.current) < 0.1) return;
      container.scrollLeft -= velocity.current;
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [stateRef]);

  return (
    <BoardPanContext.Provider value={{ start, onMove, end }}>
      {children}
    </BoardPanContext.Provider>
  );
}

export const useBoardPan = () => {
  const ctx = useContext(BoardPanContext);
  if (!ctx) {
    throw new Error("useBoardPan must be used inside BoardPanProvider");
  }
  return ctx;
};
