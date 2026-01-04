import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useBoardContext } from "@board/context/BoardContext";
import { useBoardUI } from "@board/hooks/useBoardUI";
import { useColumnModal } from "@column/hooks/useColumnModal";
import { showWarning } from "@utils/toastUtils";
import { useScreen } from "@context/ScreenContext";
import { useDismiss } from "@hooks/useDismiss";

export function useFloatingMenu() {
    const {
        activeBoard,
        activeBoardColumns: columns,
        handleAddCard: createCardData,
    } = useBoardContext();

    const { handleOpenCardModal } = useBoardUI();
    const { handleAddColumn } = useColumnModal({ activeBoard });
    const { isTouch } = useScreen();

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    const closeMenu = useCallback(() => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setOpen(false);
    }, []);

    const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);

    useDismiss({
        open,
        onClose: closeMenu,
        refs: [menuRef],
    });

    const handleMouseEnter = useCallback(() => {
        if (!isTouch) {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
            setOpen(true);
        }
    }, [isTouch]);

    const handleMouseLeave = useCallback(() => {
        if (!isTouch) {
            closeTimeoutRef.current = setTimeout(closeMenu, 300);
        }
    }, [isTouch, closeMenu]);

    const handleAddCardClick = useCallback(() => {
        if (!columns?.length) {
            showWarning("Crie algumas colunas primeiro!", {
                toastId: "no-cols-float",
            });
            closeMenu();
            return;
        }

        const newCard = createCardData();
        if (newCard) {
            handleOpenCardModal(newCard);
            closeMenu();
        }
    }, [columns, createCardData, handleOpenCardModal, closeMenu]);

    const handleAddColumnClick = useCallback(() => {
        handleAddColumn(columns?.length || 0);
        closeMenu();
    }, [handleAddColumn, columns, closeMenu]);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    return useMemo(
        () => ({
            open,
            toggleMenu,
            menuRef,
            handleMouseEnter,
            handleMouseLeave,
            handleAddCardClick,
            handleAddColumnClick,
        }),
        [
            open,
            toggleMenu,
            handleMouseEnter,
            handleMouseLeave,
            handleAddCardClick,
            handleAddColumnClick,
        ]
    );
}
