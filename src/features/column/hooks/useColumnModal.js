import { useCallback, useMemo } from "react";
import ColumnModal from "@column/components/ColumnModal/ColumnModal";

/**
 * Hook para abrir modal de coluna e retornar o título do board ativo
 */
export function useColumnModal({
    columns,
    addColumn,
    updateColumnInfo,
    updateColumnStyle,
    openModal,
    activeView,
    boards,
}) {
    /**
     * Abre o modal de criação ou edição de coluna
     * @param {number} index - Posição da coluna (para criação)
     * @param {Object} column - Dados da coluna (para edição)
     */
    const handleAddColumn = useCallback(
        (index, column) => {
            openModal(ColumnModal, {
                mode: column ? "edit" : "create",
                columnData: column || {},
                onSave: (data) => {
                    if (column) {
                        // Atualiza informações e estilo separadamente
                        updateColumnInfo(activeView, column.id, {
                            title: data.title,
                            description: data.description,
                        });
                        updateColumnStyle(activeView, column.id, {
                            color: data.color,
                            applyTo: data.applyTo,
                        });
                    } else {
                        // Criação de nova coluna
                        addColumn(activeView, index, data);
                    }
                },
            });
        },
        [activeView, addColumn, updateColumnInfo, updateColumnStyle, openModal]
    );

    /**
     * Retorna o título do board ativo
     */
    const activeBoardTitle = useMemo(() => {
        const board = boards.find((b) => b.id === activeView);
        return board?.title || activeView;
    }, [boards, activeView]);

    return { handleAddColumn, activeBoardTitle };
}
