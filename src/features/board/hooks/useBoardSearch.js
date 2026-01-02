import { useState, useEffect, useRef, useCallback } from "react";

export function useBoardSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchRef = useRef(null);
  const iconRef = useRef(null);
  const inputRef = useRef(null);

  // Quando um item é clicado
  const handleSelect = useCallback((callback) => {
    setSearchTerm("");
    setSearchOpen(false);
    if (callback) callback();
  }, []);

  // Focus automático no input ao abrir
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Fecha busca ao clicar fora
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
  };
}
