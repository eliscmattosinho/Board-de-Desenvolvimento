import { useCallback, useMemo } from "react";
import ColumnModal from "@column/components/ColumnModal/ColumnModal";

/**
 * Hook para abrir modal de coluna e retornar título do board ativo
 */
export function useColumnModal({ columns, addColumn, renameColumn, openModal, activeView, boards }) {
    const handleAddColumn = useCallback(
        (index, column) => {
            openModal(ColumnModal, {
                mode: column ? "edit" : "create",
                columnData: column || {},
                onSave: (data) => {
                    if (column) {
                        renameColumn(activeView, column.id, data);
                    } else {
                        addColumn(activeView, index, data);
                    }
                },
            });
        },
        [activeView, addColumn, renameColumn, openModal]
    );

    const activeBoardTitle = useMemo(() => {
        const board = boards.find((b) => b.id === activeView);
        return board?.title || activeView;
    }, [boards, activeView]);

    return { handleAddColumn, activeBoardTitle };
}
