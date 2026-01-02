import { useRef, useEffect } from "react";

export function useBoardScroll(boards, activeBoard) {
  const containerRef = useRef(null);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const activeBtn = containerRef.current?.querySelector(".active");
    activeBtn?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeBoard, boards]);

  const onPointerDown = (e) => {
    // Apenas botão esquerdo
    if (e.button !== 0) return;
    isDragging.current = false;
    startX.current = e.clientX;
    scrollLeftStart.current = containerRef.current.scrollLeft;
  };

  const onPointerMove = (e) => {
    // Se o usuário soltou o mouse mas o navegador não disparou Up, reseta
    if (e.buttons === 0) {
      startX.current = 0;
      return;
    }

    if (startX.current === 0) return;

    const x = e.clientX;
    const walk = x - startX.current;

    if (Math.abs(walk) > 7) {
      isDragging.current = true;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeftStart.current - walk;
      }
    }
  };

  const onPointerUp = () => {
    startX.current = 0;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleItemClick = (action) => {
    if (!isDragging.current) {
      action();
    }
  };

  return {
    containerRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    handleItemClick,
  };
}
