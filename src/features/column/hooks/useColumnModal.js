import { useCallback, useMemo } from "react";
import ColumnModal from "@column/components/ColumnModal/ColumnModal";

/**
 * Hook responsável por gerenciar a abertura de modais de coluna
 * e derivar informações da coluna ativa.
 *
 * @returns {Object} handleAddColumn, activeBoardTitle
 */
export function useColumnModal({ columns, addColumn, renameColumn, openModal, activeView, boards }) {
    const handleAddColumn = useCallback(
        (index, column) => {
            openModal(ColumnModal, {
                mode: column ? "edit" : "create",
                columnData: column,
                onSave: (data) => {
                    if (column) renameColumn(activeView, column.id, data);
                    else addColumn(activeView, index, data);
                },
            });
        },
        [activeView, renameColumn, addColumn, openModal]
    );

    const activeBoardTitle = useMemo(() => {
        return columns[activeView]?.title
            ?? boards.find(b => b.id === activeView)?.title
            ?? activeView;
    }, [columns, boards, activeView]);

    return { handleAddColumn, activeBoardTitle };
}
