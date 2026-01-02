import React, { useMemo } from "react";
import { useBoardContext } from "@board/context/BoardContext";
import { useModal } from "@/context/ModalContext";
import { useBoardSearch } from "@board/hooks/useBoardSearch";
import { useBoardScroll } from "@board/hooks/useBoardScroll";
import BoardSearch from "@board/components/BoardSearch/BoardSearch";
import "./BoardControls.css";

export default function BoardControls() {
  const { boards: boardsObj, activeBoard, setActiveBoard } = useBoardContext();
  const { isModalOpen } = useModal();

  const { searchTerm, handleSelect, ...searchProps } = useBoardSearch();

  const boards = useMemo(
    () => Object.values(boardsObj || {}).filter(Boolean),
    [boardsObj]
  );

  const { containerRef, ...scroll } = useBoardScroll(boards, activeBoard);

  const filteredBoards = useMemo(() => {
    return boards
      .filter((b) =>
        (b.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (a.groupId === b.groupId ? 0 : a.groupId ? -1 : 1));
  }, [boards, searchTerm]);

  return (
    <div className={`hub-boards-wrapper ${isModalOpen ? "modal-open" : ""}`}>
      <BoardSearch
        searchTerm={searchTerm}
        handleSelect={handleSelect}
        {...searchProps}
      />

      <div
        className="hub-boards"
        ref={containerRef}
        onPointerDown={scroll.onPointerDown}
        onPointerMove={scroll.onPointerMove}
        onPointerUp={scroll.onPointerUp}
        onPointerLeave={scroll.onPointerUp}
        onPointerCancel={scroll.onPointerUp}
      >
        {filteredBoards.map((board) => (
          <button
            key={board.id}
            className={[
              "btn",
              "btn-board",
              `btn-view-${board.id}`,
              activeBoard === board.id ? "active" : "",
              board.groupId ? "title-thematic" : "",
            ].join(" ")}
            onClick={() =>
              scroll.handleItemClick(() =>
                handleSelect(() => setActiveBoard(board.id))
              )
            }
          >
            {board.title || board.id}
          </button>
        ))}
      </div>
    </div>
  );
}
