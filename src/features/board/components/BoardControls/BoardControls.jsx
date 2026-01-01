import React, { useMemo } from "react";
import { FiSearch } from "react-icons/fi";

import { useBoardContext } from "@board/context/BoardContext";
import { useModal } from "@/context/ModalContext";

import { useBoardSearch } from "@board/hooks/useBoardSearch";
import { useBoardScroll } from "@board/hooks/useBoardScroll";

import "./BoardControls.css";

export default function BoardControls() {
  const {
    boards: boardsObj,
    activeBoard,
    setActiveBoard,
  } = useBoardContext();

  const boards = useMemo(
    () => Object.values(boardsObj || {}).filter(Boolean),
    [boardsObj]
  );

  const { isModalOpen } = useModal();

  // search hook
  const {
    searchOpen,
    setSearchOpen,
    searchTerm,
    setSearchTerm,
    searchRef,
    iconRef,
    inputRef,
  } = useBoardSearch();

  // scroll hook
  const {
    containerRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useBoardScroll(boards, activeBoard);

  // filtra boards pelo termo de busca
  const filteredBoards = useMemo(
    () =>
      boards.filter((board) =>
        (board.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [boards, searchTerm]
  );

  // separa boards de template vs independentes
  const { templateBoards, independentBoards } = useMemo(() => {
    const template = [];
    const independent = [];

    filteredBoards.forEach((b) => {
      if (b.groupId) template.push(b);
      else independent.push(b);
    });

    return { templateBoards: template, independentBoards: independent };
  }, [filteredBoards]);

  return (
    <div className={`hub-boards-wrapper ${isModalOpen ? "modal-open" : ""}`}>
      {/* Search overlay */}
      <div
        className={`search-overlay ${searchOpen ? "open" : ""}`}
        ref={searchRef}
      >
        <button
          ref={iconRef}
          className="board-icon search-icon"
          onClick={() => setSearchOpen((prev) => !prev)}
          data-tooltip="Pesquisar board"
        >
          <FiSearch size={20} />
        </button>

        <input
          ref={inputRef}
          type="text"
          id="searchBoard"
          name="searchBoard"
          placeholder="Pesquisar board..."
          className="input-entry search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* Container dos botões */}
      <div
        className="hub-boards"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {[...templateBoards, ...independentBoards].length > 0 ? (
          [...templateBoards, ...independentBoards].map((board) => (
            <button
              key={board.id}
              className={[
                "btn",
                "btn-board",
                `btn-view-${board.id}`,
                activeBoard === board.id ? "active" : "",
                board.groupId ? "title-thematic" : "",
              ].join(" ")}
              onClick={() => setActiveBoard(board.id)}
            >
              {board.title || board.id}
            </button>
          ))
        ) : (
          <p className="no-boards-placeholder">
            Nenhum board encontrado
          </p>
        )}
      </div>
    </div>
  );
}
