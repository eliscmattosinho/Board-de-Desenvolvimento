import { useRef, useEffect } from "react";

/**
 * Hook para gerenciar o scroll horizontal via arraste (drag-to-scroll)
 * e auto-centralização do item ativo.
 * * @param {Array} boards - Lista de boards para disparar o scroll quando mudar.
 * @param {string} activeBoard - ID do board ativo.
 * @param {string} activeClassName - Classe CSS usada para identificar o item ativo (default: .active).
 */
export function useBoardScroll(
  boards,
  activeBoard,
  activeClassName = ".active"
) {
  const containerRef = useRef(null);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isDragging = useRef(false);

  // Efeito para centralizar o board selecionado automaticamente
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

  const onPointerDown = (e) => {
    // Garante que apenas o botão principal (esquerdo) inicie o arraste
    if (e.button !== 0) return;

    isDragging.current = false;
    startX.current = e.clientX;
    scrollLeftStart.current = containerRef.current
      ? containerRef.current.scrollLeft
      : 0;
  };

  const onPointerMove = (e) => {
    // Fallback: se o ponteiro se mover sem botões pressionados, cancela o arraste
    if (e.buttons === 0) {
      startX.current = 0;
      return;
    }

    if (startX.current === 0) return;

    const x = e.clientX;
    const walk = x - startX.current;

    // Threshold de 7 pixels para evitar que cliques acidentais sejam interpretados como drag
    if (Math.abs(walk) > 7) {
      isDragging.current = true;
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeftStart.current - walk;
      }
    }
  };

  const onPointerUp = () => {
    startX.current = 0;
    // Pequeno delay para garantir que o evento de clique não dispare
    // imediatamente após soltar um arraste longo
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  /**
   * Wrapper para cliques em itens dentro do scroll.
   * Impede que a ação de clique ocorra se o usuário estiver apenas arrastando o container.
   */
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
