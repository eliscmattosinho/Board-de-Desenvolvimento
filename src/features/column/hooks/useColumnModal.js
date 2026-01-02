import { useCallback } from "react";
import ColumnModal from "@column/components/ColumnModal/ColumnModal";

/**
 * Hook para abrir modal de coluna e gerenciar a persistência de dados iniciais
 */
export function useColumnModal({
    addColumn,
    updateColumnInfo,
    updateColumnStyle,
    openModal,
    activeBoard,
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
                        // EDIÇÃO: Atualiza informações e estilo
                        updateColumnInfo(activeBoard, column.id, {
                            title: data.title,
                            status: data.status || column.status, // Garante que o status não se perca
                            description: data.description,
                        });
                        updateColumnStyle(activeBoard, column.id, {
                            color: data.color,
                            applyTo: data.applyTo,
                        });
                    } else {
                        // CRIAÇÃO: Adiciona campos vitais para o domínio de Card
                        const newColumnPayload = {
                            ...data,
                            // Garante um ID único para evitar duplicação no storage
                            id: `col-${Date.now()}`,
                            // Garante um status para que o CardContext saiba criar cards aqui
                            status: data.status || "todo",
                        };

                        addColumn(activeBoard, index, newColumnPayload);
                    }
                },
            });
        },
        [activeBoard, addColumn, updateColumnInfo, updateColumnStyle, openModal]
    );

    return { handleAddColumn };
}
