import { useMemo, useCallback } from "react";
import { showWarning, showCustom, showSuccess } from "@utils/toastUtils";
import ClearBoardToast from "@components/ToastProvider/toasts/ClearBoardToast";
import CardModal from "@card/components/CardModal/CardModal";
import { syncedBoardsMap } from "@board/utils/boardSyncUtils";
import { getMirrorColumnIdSafe, getDisplayStatus } from "@board/components/templates/templateMirror";

/**
 * Hook responsável por preparar as tasks para exibição no board ativo,
 * expõe handlers para adicionar / limpar / abrir task.
 *
 * - Diferencia boards "shared" (espelhados) de boards independentes
 * - Para boards independentes: filtra apenas por boardId, não aplica espelhamento de colunas nem o group clearing
 * - Para boards compartilhados: agrupa por groupId e aplica mirror column id / displayStatus
 */
export function useBoardTasks({
  tasks,
  addTask,
  moveTask,
  clearTasks,
  columns,
  activeBoard,
  openModal
}) {
  // ordenação global (base para operações de slice/filtragem)
  const orderedGlobal = useMemo(
    () => [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [tasks]
  );

  // determina se o board ativo pertence a um grupo ou é independente
  const activeGroupId = syncedBoardsMap[activeBoard] ?? null;
  const isSharedBoard = Boolean(activeGroupId);

  // lista de boards que pertencem ao mesmo grupo do activeBoard
  const boardsInGroup = useMemo(() => {
    if (!isSharedBoard) return [];
    return Object.keys(syncedBoardsMap).filter(
      (b) => (syncedBoardsMap[b] ?? b) === activeGroupId
    );
  }, [activeGroupId, isSharedBoard]);

  // tasks ordenadas e adaptadas para exibição no view do activeBoard
  const orderedTasks = useMemo(() => {
    return orderedGlobal
      .filter((t) => {
        if (isSharedBoard) {
          const tGroup = syncedBoardsMap[t.boardId] ?? null;
          return tGroup === activeGroupId;
        }
        // board independente — apenas tasks com boardId igual
        return t.boardId === activeBoard;
      })
      .map((t) => {
        if (!isSharedBoard) {
          // não aplicar espelhamento em boards independentes
          return {
            ...t,
            displayColumnId: t.columnId ?? null,
            displayStatus: t.status ?? null
          };
        }

        const displayColumnId =
          t.boardId === activeBoard
            ? t.columnId
            : getMirrorColumnIdSafe(activeBoard, t.columnId);
        const displayStatus = getDisplayStatus(displayColumnId, activeBoard);

        return {
          ...t,
          displayColumnId,
          displayStatus
        };
      });
  }, [orderedGlobal, activeBoard, isSharedBoard, activeGroupId]);

  // adiciona nova task e abre modal, não tenta espelhar se o board for independente
  const handleAddTask = useCallback(
    (columnId = null) => {
      const viewColumns = columns?.[activeBoard] ?? [];
      const fallbackColumnId = viewColumns[0]?.id ?? null;
      const chosenColumnId = columnId ?? fallbackColumnId;

      let mirroredColumnId = null;

      if (isSharedBoard) {
        // se tiver encontra outro board do group para calcular coluna espelhada
        const otherBoard = boardsInGroup.find((b) => b !== activeBoard);
        if (otherBoard) {
          mirroredColumnId = getMirrorColumnIdSafe(otherBoard, chosenColumnId);
        }
      }

      const newTask = addTask(chosenColumnId, {
        boardId: activeBoard,
        mirroredColumnId
      });

      openModal(CardModal, {
        task: { ...newTask, isNew: true },
        activeBoard,
        columns: columns?.[activeBoard] ?? [],
        moveTask
      });
    },
    [addTask, activeBoard, columns, isSharedBoard, boardsInGroup, moveTask, openModal]
  );

  /**
   * limpa o board:
   * para shared -> limpa o grupo
   * para independente -> limpa somente o board
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

  // abrir modal de edição / visualização da task, cols passadas são as do activeBoard
  const handleTaskClick = useCallback(
    (task) => {
      openModal(CardModal, {
        task,
        activeBoard,
        columns: columns?.[activeBoard] ?? [],
        moveTask
      });
    },
    [activeBoard, columns, moveTask, openModal]
  );

  // contador de tarefas exibidas para o activeBoard (respeita shared ou independente)
  const activeBoardTaskCount = useMemo(() => {
    const groupId = syncedBoardsMap[activeBoard] ?? null;
    const isShared = Boolean(groupId);

    return orderedGlobal.filter((t) =>
      isShared ? (syncedBoardsMap[t.boardId] ?? null) === groupId : t.boardId === activeBoard
    ).length;
  }, [orderedGlobal, activeBoard]);

  return {
    orderedTasks,
    handleAddTask,
    handleClearBoard,
    handleTaskClick,
    activeBoardTaskCount
  };
}
