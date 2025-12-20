import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { SiCcleaner } from "react-icons/si";

import ThemeToggle from "@components/ThemeToggle/ThemeToggle";
import BoardSection from "@board/components/BoardSection";
import BoardControls from "@board/components/BoardControls";
import FloatingMenu from "@components/FloatingMenu/FloatingMenu";
import DragPreview from "@board/components/DragPreview/DragPreview";

import { useBoardContext } from "@board/context/BoardContext";
import { useGesture } from "@board/context/GestureContext";
import BoardForm from "@features/board/components/BoardForm";

import svgDarkBoard from "@assets/images/svg-board.svg";
import svgLightBoard from "@assets/images/svg-light-board.svg";

import "./Hub.css";

export default function Hub() {
  const navigate = useNavigate();
  const { onPointerUp } = useGesture();

  const {
    theme,
    activeBoard,
    setActiveBoard,
    columns,
    orderedTasks,
    commitDrop,
    handleAddTask,
    handleClearBoard,
    handleTaskClick,
    handleAddColumn,
    removeColumn,
    activeBoardTitle,
    activeBoardTaskCount,
    openModal,
    createBoard,
  } = useBoardContext();

  const boardImage = theme === "dark" ? svgDarkBoard : svgLightBoard;

  const openNewBoardModal = () =>
    openModal(BoardForm, { onConfirm: createBoard });

  return (
    <>
      {/* Preview flutuante do card (portal) */}
      <DragPreview />

      <main id="hub-container">
        <section className="hub-content">
          {/* Actions */}
          <div className="hub-actions">
            <button
              onClick={() => navigate("/")}
              className="board-icon btn-back"
            >
              <FaArrowCircleLeft size={30} />
            </button>

            <div className="hub-sub-actions">
              <ThemeToggle />
              <button
                id="new-board"
                className="btn btn-thematic"
                onClick={openNewBoardModal}
              >
                Novo board
              </button>
            </div>
          </div>

          {/* Header */}
          <header className="hub-header">
            <div className="hub-introduction">
              <div className="hub-infos">
                <h1 className="hub-title title-thematic">
                  Development Hub
                </h1>
                <p className="sub-title">
                  Escolha seu board de visualização.
                </p>
              </div>

              <BoardControls
                activeBoard={activeBoard}
                setActiveBoard={setActiveBoard}
              />
            </div>

            <div className="img-container hub-img-container">
              <img
                src={boardImage}
                alt="Illustration of a dashboard interface"
              />
            </div>
          </header>

          <article className="hub-active-board">
            <header className="board-header">
              <div className="board-title-container">
                <h3 id="board-title" className="title-thematic">
                  {activeBoardTitle ?? "Board"}
                  <span className="task-counter">
                    ({activeBoardTaskCount ?? 0})
                  </span>
                </h3>

                <FloatingMenu
                  columns={columns?.[activeBoard] ?? []}
                  onAddTask={handleAddTask}
                  onAddColumn={handleAddColumn}
                />
              </div>

              <button
                id="board-cleaner"
                className="board-icon clean-icon"
                onClick={handleClearBoard}
                data-tooltip="Limpar tarefas"
              >
                <SiCcleaner size={30} />
              </button>
            </header>

            <div
              className="board-content"
              onPointerUp={(e) => {
                onPointerUp(e);
                commitDrop();
              }}
              onPointerCancel={(e) => {
                onPointerUp(e);
                commitDrop();
              }}
              onLostPointerCapture={(e) => {
                onPointerUp(e);
                commitDrop();
              }}
            >
              <BoardSection
                id={activeBoard}
                columns={columns?.[activeBoard] ?? []}
                tasks={orderedTasks}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
                onAddColumn={handleAddColumn}
                removeColumn={removeColumn}
                activeBoard={activeBoard}
                isActive
              />
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
