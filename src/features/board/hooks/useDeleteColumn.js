import { useCallback } from "react";
import { useModal } from "@context/ModalContext";
import ConfirmDeleteModal from "@components/Modal/DeleteModal/ConfirmDeleteModal";

export function useDeleteColumn({ removeColumn, activeBoard }) {
  const { openModal, closeModal } = useModal();

  return useCallback(
    (col) => {
      openModal(ConfirmDeleteModal, {
        type: "column",
        onConfirm: () => {
          removeColumn(activeBoard, col.id);
          closeModal();
        },
        onCancel: closeModal,
      });
    },
    [removeColumn, activeBoard, openModal, closeModal]
  );
}
