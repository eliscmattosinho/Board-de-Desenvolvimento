import { useMemo, useCallback } from "react";
import { showWarning, showCustom, showSuccess } from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";
import { getDisplayStatus } from "@board/components/templates/taskBoardResolver";

/**
 * Hook responsável por preparar as tasks para exibição no board ativo,
 * expõe handlers para adicionar / limpar / abrir task.
 */
export function useBoardTasks({
  tasks,
  addTask,
  moveTask,
  clearTasks,
  columns,
  activeBoard,
  openModal,
}) {
  /**
   * Ordenação global
   */
  const orderedGlobal = useMemo(
    () => [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [tasks]
  );

  /**
   * Identificação de board compartilhado
   */
  const activeGroupId = syncedBoardsMap[activeBoard] ?? null;
  const isSharedBoard = Boolean(activeGroupId);

  /**
   * Tasks adaptadas para exibição no board ativo
   */
  const orderedTasks = useMemo(() => {
    return orderedGlobal
      .filter((t) => {
        if (isSharedBoard) {
          const tGroup = syncedBoardsMap[t.boardId] ?? null;
          return tGroup === activeGroupId;
        }
        return t.boardId === activeBoard;
      })
      .map((t) => {
        if (!isSharedBoard) {
          return {
            ...t,
            displayColumnId: t.columnId ?? null,
            displayStatus: t.status ?? null,
          };
        }

        const displayColumnId =
          t.boardId === activeBoard ? t.columnId : t.mirrorColId;

        const displayStatus = getDisplayStatus(
          displayColumnId,
          activeBoard
        );

        return {
          ...t,
          displayColumnId,
          displayStatus,
        };
      });
  }, [orderedGlobal, activeBoard, isSharedBoard, activeGroupId]);

  /**
   * Adiciona nova task e abre modal
   */
  const handleAddTask = useCallback(
    (columnId = null) => {
      const viewColumns = columns?.[activeBoard] ?? [];
      const fallbackColumnId = viewColumns[0]?.id ?? null;
      const chosenColumnId = columnId ?? fallbackColumnId;

      const newTask = addTask(chosenColumnId, {
        boardId: activeBoard,
      });

      openModal(CardModal, {
        task: { ...newTask, isNew: true },
        activeBoard,
        columns: viewColumns,
        moveTask,
      });
    },
    [addTask, activeBoard, columns, moveTask, openModal]
  );

  /**
   * Limpa tasks do board ou grupo
   */
  const handleClearBoard = useCallback(() => {
    const groupId = syncedBoardsMap[activeBoard] ?? null;
    const isShared = Boolean(groupId);

    const boardTasks = orderedGlobal.filter((t) =>
      isShared
        ? (syncedBoardsMap[t.boardId] ?? null) === groupId
        : t.boardId === activeBoard
    );

    if (boardTasks.length === 0) {
      showWarning("Não há tarefas para remover — o board já está vazio!");
      return;
    }

    showCustom(({ closeToast }) => (
      <ClearBoardToast
        onConfirm={() => {
          if (isShared) {
            clearTasks({ groupId });
          } else {
            clearTasks({ boardId: activeBoard });
          }
          closeToast();
          showSuccess("Todas as tarefas foram removidas com sucesso!");
        }}
        onCancel={closeToast}
      />
    ));
  }, [orderedGlobal, activeBoard, clearTasks]);

  /**
   * Abre modal de edição / visualização
   */
  const handleTaskClick = useCallback(
    (task) => {
      openModal(CardModal, {
        task,
        activeBoard,
        columns: columns?.[activeBoard] ?? [],
        moveTask,
      });
    },
    [activeBoard, columns, moveTask, openModal]
  );

  /**
   * Contador de tasks do board ativo
   */
  const activeBoardTaskCount = useMemo(() => {
    const groupId = syncedBoardsMap[activeBoard] ?? null;
    const isShared = Boolean(groupId);

    return orderedGlobal.filter((t) =>
      isShared
        ? (syncedBoardsMap[t.boardId] ?? null) === groupId
        : t.boardId === activeBoard
    ).length;
  }, [orderedGlobal, activeBoard]);

  return {
    orderedTasks,
    handleAddTask,
    handleClearBoard,
    handleTaskClick,
    activeBoardTaskCount,
  };
}
