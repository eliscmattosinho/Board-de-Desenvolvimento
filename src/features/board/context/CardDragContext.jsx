import { createContext, useContext, useRef, useCallback } from "react";

const CardDragContext = createContext(null);

export function CardDragProvider({ children }) {
  const dragRef = useRef({
    active: false,
    task: null,
    over: null,
  });

  const startDrag = useCallback((task) => {
    dragRef.current.active = true;
    dragRef.current.task = task;
    dragRef.current.over = null;
  }, []);

  const setDropTarget = useCallback((target) => {
    if (!dragRef.current.active) return;
    dragRef.current.over = target;
  }, []);

  const isDraggingCard = useCallback(() => {
    return dragRef.current.active;
  }, []);

  /**
   * Apenas encerra o drag visual/interativo
   * NÃO consome o estado
   */
  const endDrag = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  /**
   * Commit explícito do drop (usado pelo Board)
   */
  const commitDrop = useCallback(() => {
    const { task, over } = dragRef.current;

    dragRef.current.task = null;
    dragRef.current.over = null;

    if (!task || !over) return null;

    return {
      taskId: task.id,
      target: over,
    };
  }, []);

  return (
    <CardDragContext.Provider
      value={{
        dragRef,
        startDrag,
        setDropTarget,
        endDrag,
        commitDrop,
        isDraggingCard,
      }}
    >
      {children}
    </CardDragContext.Provider>
  );
}

export const useCardDrag = () => {
  const ctx = useContext(CardDragContext);
  if (!ctx) {
    throw new Error("useCardDrag must be used inside CardDragProvider");
  }
  return ctx;
};
