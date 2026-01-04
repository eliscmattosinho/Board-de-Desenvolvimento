import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useBoardContext } from "@board/context/BoardContext";
import { useBoardUI } from "@board/hooks/useBoardUI";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { showWarning } from "@utils/toastUtils";

export function useFloatingMenu() {
    const {
        activeBoard,
        activeBoardColumns: columns,
        handleAddCard: createCardData,
    } = useBoardContext();

    const { handleOpenCardModal } = useBoardUI();
    const { handleAddColumn } = useColumnModal({ activeBoard });

    const [open, setOpen] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const menuRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    useEffect(() => {
        const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        setIsTouch(touch);
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (!isTouch) {
            clearTimeout(closeTimeoutRef.current);
            setOpen(true);
        }
    }, [isTouch]);

    const handleMouseLeave = useCallback(() => {
        if (!isTouch) {
            closeTimeoutRef.current = setTimeout(() => setOpen(false), 300);
        }
    }, [isTouch]);

    const handleAddCardClick = useCallback(() => {
        if (!columns || columns.length === 0) {
            showWarning(
                "Ops! Não tenho para onde ir, crie algumas colunas primeiro."
            );
            setOpen(false);
            return;
        }
        const newCard = createCardData();
        if (newCard) handleOpenCardModal(newCard);
        setOpen(false);
    }, [columns, createCardData, handleOpenCardModal]);

    const handleAddColumnClick = useCallback(() => {
        handleAddColumn(columns?.length || 0);
        setOpen(false);
    }, [handleAddColumn, columns]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    // Evitar re-renders desnecessários no componente
    return useMemo(
        () => ({
            open,
            setOpen,
            menuRef,
            handleMouseEnter,
            handleMouseLeave,
            handleAddCardClick,
            handleAddColumnClick,
        }),
        [
            open,
            handleMouseEnter,
            handleMouseLeave,
            handleAddCardClick,
            handleAddColumnClick,
        ]
    );
}
