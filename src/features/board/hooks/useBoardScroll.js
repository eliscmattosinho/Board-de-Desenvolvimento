import { useRef, useEffect, useCallback, useState } from "react";

export function useBoardScroll(
  boards,
  activeBoard,
  activeClassName = ".active"
) {
  const containerRef = useRef(null);
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  // Centraliza o item ativo automaticamente
  useEffect(() => {
    const activeBtn = containerRef.current?.querySelector(activeClassName);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeBoard, boards, activeClassName]);

  const onPointerDown = useCallback((e) => {
    isDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftStart.current = containerRef.current.scrollLeft;
    dragDistance.current = 0;
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!isDown.current) return;

      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = x - startX.current;
      dragDistance.current = Math.abs(walk);

      // Threshold de 8px para ativar o estado de arraste
      if (dragDistance.current > 8) {
        if (!isDraggingActive) setIsDraggingActive(true);
        containerRef.current.scrollLeft = scrollLeftStart.current - walk;
      }
    },
    [isDraggingActive]
  );

  const onPointerUp = useCallback(() => {
    isDown.current = false;
    // Resetar o cursor sem interromper o evento de clique
    setTimeout(() => {
      setIsDraggingActive(false);
    }, 50);
  }, []);

  const handleItemClick = useCallback((e, action) => {
    // Se o movimento foi menor que 10px, valida como clique
    if (dragDistance.current < 10) {
      action();
    }
  }, []);

  const scrollEvents = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave: onPointerUp,
  };

  return {
    containerRef,
    scrollEvents,
    handleItemClick,
    isDraggingActive,
  };
}
