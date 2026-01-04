import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Gerencia o estado da busca e a filtragem dos boards.
 * @param {Array} boards - Lista bruta de boards vindos do contexto.
 */
export function useBoardSearch(boards = []) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchRef = useRef(null);
  const iconRef = useRef(null);
  const inputRef = useRef(null);

  // Lógica de filtragem: "Começa com"
  const filteredBoards = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return boards;

    return boards.filter((board) => {
      const title = (board.title || "").toLowerCase();
      return title.startsWith(term);
    });
  }, [boards, searchTerm]);

  // Limpa a busca e fecha ao selecionar um item
  const handleSelect = useCallback((callback) => {
    setSearchTerm("");
    setSearchOpen(false);
    if (callback) callback();
  }, []);

  // Focus automático ao abrir o input
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Fecha o campo de busca ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      const clickedInsideSearch = searchRef.current?.contains(e.target);
      const clickedIcon = iconRef.current?.contains(e.target);

      if (!clickedInsideSearch && !clickedIcon) {
        setSearchOpen(false);
      }
    }

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  return {
    searchOpen,
    setSearchOpen,
    searchTerm,
    setSearchTerm,
    searchRef,
    iconRef,
    inputRef,
    handleSelect,
    filteredBoards,
  };
}
