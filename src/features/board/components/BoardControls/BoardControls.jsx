import React, { useMemo } from "react";
import { useBoardContext } from "@board/context/BoardContext";
import { useModal } from "@context/ModalContext";
import { useBoardSearch } from "@board/hooks/useBoardSearch";
import { useBoardScroll } from "@board/hooks/useBoardScroll";
import BoardSearch from "@board/components/BoardSearch/BoardSearch";
import "./BoardControls.css";

export default function BoardControls() {
  const { boards: boardsObj, activeBoard, setActiveBoard } = useBoardContext();
  const { isModalOpen } = useModal();

  // Prepara a lista base (array + ordenação)
  const boardsBase = useMemo(() => {
    return Object.values(boardsObj || {})
      .filter(Boolean)
      .sort((a, b) => (a.groupId === b.groupId ? 0 : a.groupId ? -1 : 1));
  }, [boardsObj]);

  // Busca e filtragem
  const search = useBoardSearch(boardsBase);

  // Scroll configurado com a lista filtrada
  const { containerRef, scrollEvents, handleItemClick, isDraggingActive } =
    useBoardScroll(search.filteredBoards, activeBoard);

  return (
    <div className={`hub-boards-wrapper ${isModalOpen ? "modal-open" : ""}`}>
      <BoardSearch search={search} />

      <div
        ref={containerRef}
        className={`hub-boards 
          ${isDraggingActive ? "is-grabbing" : ""}
        `}
        {...scrollEvents}
      >
        {search.filteredBoards.length > 0 ? (
          search.filteredBoards.map((board) => (
            <button
              type="button"
              key={board.id}
              className={`btn btn-board btn-view-${board.id} 
                ${activeBoard === board.id ? "active" : ""} 
                ${board.groupId ? "title-thematic" : ""}`}
              onClick={(e) =>
                handleItemClick(e, () =>
                  search.handleSelect(() => setActiveBoard(board.id))
                )
              }
            >
              {board.title || board.id}
            </button>
          ))
        ) : (
          <span className="no-results-msg">
            Nenhum board encontrado para "{search.searchTerm}"
          </span>
        )}
      </div>
    </div>
  );
}
