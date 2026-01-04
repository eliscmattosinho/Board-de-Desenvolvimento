import React from "react";
import { FiSearch } from "react-icons/fi";
import "./BoardSearch.css";

export default function BoardSearch({ search }) {
    const {
        searchOpen,
        setSearchOpen,
        searchTerm,
        setSearchTerm,
        searchRef,
        iconRef,
        inputRef,
    } = search;

    return (
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
    );
}
