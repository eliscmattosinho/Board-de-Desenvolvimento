import React, { useRef, useEffect, useState } from "react";
import { useBoardContext } from "@board/context/BoardContext";
import { useModal } from "@/context/ModalContext";

import { FiSearch } from "react-icons/fi";
import "./BoardControls.css";

function BoardControls({ activeView, setActiveView }) {
  const { boards } = useBoardContext();
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const iconRef = useRef(null);
  const inputRef = useRef(null);
  const { isModalOpen } = useModal();

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getButtonClass = (board) => {
    const classes = ["btn", "btn-board", `btn-view-${board.id}`];
    if (activeView === board.id) classes.push("active");
    if (["kanban", "scrum"].includes(board.id)) classes.push("title-thematic");
    return classes.join(" ");
  };

  // Drag to scroll
  // @TODO unificar
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Scroll active board location
  useEffect(() => {
    const container = containerRef.current;
    const activeBtn = container.querySelector(".active");
    if (activeBtn) {
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollPosition =
        btnLeft - containerWidth / 2 + btnWidth / 2;
      container.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  }, [activeView, boards]);

  // Clean search
  useEffect(() => {
    if (!searchOpen) setSearchTerm("");
  }, [searchOpen]);

  // Input focus when open
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [searchOpen]);

  // Close out touch
  useEffect(() => {
    function handleClickOutside(e) {
      const clickedInsideSearch =
        searchRef.current && searchRef.current.contains(e.target);
      const clickedIcon =
        iconRef.current && iconRef.current.contains(e.target);

      if (!clickedInsideSearch && !clickedIcon) {
        setSearchOpen(false);
      }
    }

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // Filter
  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`hub-boards-wrapper ${isModalOpen ? "modal-open" : ""}`}
    >

      {/* Overlay do search */}
      <div
        className={`search-overlay ${searchOpen ? "open" : ""}`}
        ref={searchRef}
      >
        <FiSearch
          ref={iconRef}
          className="board-icon search-icon"
          size={20}
          onClick={() => setSearchOpen((prev) => !prev)}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Pesquisar board..."
          className="input-entry search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
        {filteredBoards.length > 0 ? (
          filteredBoards.map((board) => (
            <button
              key={board.id}
              className={getButtonClass(board)}
              onClick={() => setActiveView(board.id)}
            >
              {board.title}
            </button>
          ))
        ) : (
          <div className="no-boards-placeholder">
            Nenhum board encontrado
          </div>
        )}
      </div>

    </div>
  );
}

export default BoardControls;
