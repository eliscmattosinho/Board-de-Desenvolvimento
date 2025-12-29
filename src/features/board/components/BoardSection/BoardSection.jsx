import React, { useCallback, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";

import { useGesture } from "@/context/GestureContext";
import { useBoardPan } from "@board/context/BoardPanContext";
import { useModal } from "@context/ModalContext";
import { useScreen } from "@context/ScreenContext";

import { useTasksByColumn } from "@board/hooks/useTasksByColumn";
import { useColumnHover } from "@board/hooks/useColumnHover";
import { useDeleteColumn } from "@board/hooks/useDeleteColumn";

import BoardColumns from "@board/components/BoardColumns";

import "./BoardSection.css";

function BoardSection({
  id,
  columns,
  tasks,
  onTaskClick,
  onAddTask,
  onAddColumn,
  removeColumn,
  activeBoard,
  isActive,
}) {
  const containerRef = useRef(null);

  const { isTouch } = useScreen();
  const { isModalOpen } = useModal();

  const { onPointerDown, onPointerMove, onPointerUp } = useGesture();
  const { start, onMove, end } = useBoardPan();

  const { hoveredIndex, onEnter, onLeave } = useColumnHover();
  const deleteColumn = useDeleteColumn({ removeColumn, activeBoard });

  const tasksByColumn = useTasksByColumn({
    columns,
    tasks,
    activeBoard,
  });

  const handleEditColumn = useCallback(
    (index, col) => () => onAddColumn(index, col),
    [onAddColumn]
  );

  const handleRemoveColumn = useCallback(
    (col) => () => deleteColumn(col),
    [deleteColumn]
  );

  const handleAddColumnAt = useCallback(
    (index, e) => {
      e?.stopPropagation();
      onAddColumn(index);
    },
    [onAddColumn]
  );

  return (
    <div
      ref={containerRef}
      id={id}
      className={`board-container ${id}-board ${isActive ? "active" : ""}`}
      onPointerDown={(e) => {
        onPointerDown({
          e,
          source: "board",
          meta: { boardId: id },
        });
        start(e, containerRef.current);
      }}
      onPointerMove={(e) => {
        onPointerMove(e);
        onMove(e, containerRef.current);
      }}
      onPointerUp={(e) => {
        end(containerRef.current);
        onPointerUp(e);
      }}
      onPointerCancel={(e) => {
        end(containerRef.current);
        onPointerUp(e);
      }}
      onLostPointerCapture={(e) => {
        end(containerRef.current);
        onPointerUp(e);
      }}
    >
      <BoardColumns
        columns={columns}
        tasksByColumn={tasksByColumn}
        isTouch={isTouch}
        isModalOpen={isModalOpen}
        hoveredIndex={hoveredIndex}
        onHoverEnter={onEnter}
        onHoverLeave={onLeave}
        onAddColumnAt={handleAddColumnAt}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
        onEditColumn={handleEditColumn}
        onRemoveColumn={handleRemoveColumn}
      />

      <div className="col-add-last">
        <button
          className="add-col"
          onClick={() => onAddColumn(columns.length)}
        >
          <CiCirclePlus className="plus-icon" size={30} />
        </button>
        <p>Criar nova coluna</p>
      </div>
    </div>
  );
}

export default React.memo(BoardSection);
