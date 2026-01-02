import { useCallback } from "react";
import { useModal } from "@context/ModalContext";
import { useBoardContext } from "@board/context/BoardContext";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";
import { showSuccess } from "@utils/toastUtils";

export function useDeleteColumn() {
  const { openModal, closeModal } = useModal();
  const { removeColumn, activeBoard } = useBoardContext();

  return useCallback(
    (col) => {
      openModal(ConfirmDeleteModal, {
        type: "column",
        title: col.title,
        onConfirm: () => {
          removeColumn(activeBoard, col.id);

          showSuccess(`Coluna "${col.title}" foi excluída com sucesso!`);

          closeModal();
        },
        onCancel: closeModal,
      });
    },
    [removeColumn, activeBoard, openModal, closeModal]
  );
}
