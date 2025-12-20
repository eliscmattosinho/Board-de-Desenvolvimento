import React, { createContext, useContext, useRef, useCallback } from "react";

const GestureContext = createContext(null);

const DRAG_THRESHOLD = 6;
const LONG_PRESS_DELAY = 350;

export function GestureProvider({ children }) {
  const stateRef = useRef({
    mode: "idle", // idle | pan | drag-card
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    source: null, // "board" | "card"
    meta: {},
  });

  const timers = useRef({
    longPress: null,
  });

  const reset = useCallback(() => {
    clearTimeout(timers.current.longPress);
    timers.current.longPress = null;

    Object.assign(stateRef.current, {
      mode: "idle",
      pointerId: null,
      source: null,
      meta: {},
    });
  }, []);

  const onPointerDown = useCallback(({ e, source, meta }) => {
    const s = stateRef.current;

    Object.assign(s, {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      source,
      meta,
      mode: "idle",
    });

    if (source === "card") {
      timers.current.longPress = setTimeout(() => {
        s.mode = "drag-card";
        e.currentTarget?.setPointerCapture?.(e.pointerId);
      }, LONG_PRESS_DELAY);
    }
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      const s = stateRef.current;
      if (e.pointerId !== s.pointerId) return;

      if (e.buttons === 0) {
        reset();
        return;
      }

      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      const distance = Math.hypot(dx, dy);

      if (s.mode === "idle" && distance > DRAG_THRESHOLD) {
        clearTimeout(timers.current.longPress);
        timers.current.longPress = null;

        if (s.source === "board") {
          s.mode = "pan";
          e.currentTarget?.setPointerCapture?.(e.pointerId);
        }
      }

      s.lastX = e.clientX;
      s.lastY = e.clientY;
    },
    [reset]
  );

  const onPointerUp = useCallback(
    (e) => {
      const snapshot = { ...stateRef.current };

      try {
        e.currentTarget?.releasePointerCapture?.(snapshot.pointerId);
      } catch {}

      reset();
      return snapshot;
    },
    [reset]
  );

  return (
    <GestureContext.Provider
      value={{
        stateRef,
        onPointerDown,
        onPointerMove,
        onPointerUp,
      }}
    >
      {children}
    </GestureContext.Provider>
  );
}

export const useGesture = () => {
  const ctx = useContext(GestureContext);
  if (!ctx) {
    throw new Error("useGesture must be used inside GestureProvider");
  }
  return ctx;
};
