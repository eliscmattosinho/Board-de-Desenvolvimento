import { useState, useEffect, useRef } from "react";

export function useBoardSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchRef = useRef(null);
  const iconRef = useRef(null);
  const inputRef = useRef(null);

  // Limpa search quando fecha
  useEffect(() => {
    if (!searchOpen) setSearchTerm("");
  }, [searchOpen]);

  // Focus input
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [searchOpen]);

  // Fecha search clicando fora
  useEffect(() => {
    function handleClickOutside(e) {
      const clickedInsideSearch = searchRef.current?.contains(e.target);
      const clickedIcon = iconRef.current?.contains(e.target);
      if (!clickedInsideSearch && !clickedIcon) setSearchOpen(false);
    }

    if (searchOpen) document.addEventListener("mousedown", handleClickOutside);
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
  };
}
