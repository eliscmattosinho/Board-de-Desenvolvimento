import { useCallback } from "react";
import ColumnModal from "@column/components/ColumnModal/ColumnModal";
import { useColumnsContext } from "@column/context/ColumnContext";
import { useModal } from "@/context/ModalContext";

/**
 * Hook autônomo para gerenciar a abertura e o salvamento de colunas.
 */
export function useColumnModal({ activeBoard }) {
    const { addColumn, updateColumnInfo, updateColumnStyle } =
        useColumnsContext();
    const { openModal } = useModal();

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
                            id: `col-${Date.now()}`,
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
