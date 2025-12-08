import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { SiCcleaner } from "react-icons/si";

import ThemeToggle from "@components/ThemeToggle/ThemeToggle";
import BoardSection from "@board/components/BoardSection";
import BoardControls from "@board/components/BoardControls";
import FloatingMenu from "@components/FloatingMenu/FloatingMenu";

import { useBoardContext } from "@board/context/BoardContext";
import BoardForm from "@features/board/components/BoardForm";

import svgDarkBoard from "@assets/images/svg-board.svg";
import svgLightBoard from "@assets/images/svg-light-board.svg";

import "./Hub.css";

export default function Hub() {
  const navigate = useNavigate();
  const {
    theme,
    activeBoard,
    setActiveBoard,
    columns,
    orderedTasks,
    allowDrop,
    handleDragStart,
    handleDrop,
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

  const openNewBoardModal = () => openModal(BoardForm, { onConfirm: createBoard });

  return (
    <div id="hub-container">
      <div className="hub-content">
        {/* Actions */}
        <div className="hub-actions">
          <button onClick={() => navigate("/")} className="board-icon btn-back">
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
        <div className="hub-header">
          <div className="hub-introduction">
            <div className="hub-infos">
              <h2 className="hub-title title-thematic">Development Hub</h2>
              <p className="sub-title">Escolha seu board de visualização.</p>
            </div>
            <BoardControls activeBoard={activeBoard} setActiveBoard={setActiveBoard} />
          </div>
          <div className="img-container hub-img-container">
            <img src={boardImage} alt="Illustration of a dashboard interface" />
          </div>
        </div>

        {/* Active Board */}
        <div className="hub-active-board">
          <div className="board-header">
            <div className="board-title-container">
              <h3 id="board-title" className="title-thematic">
                {activeBoardTitle}
                <span className="task-counter">({activeBoardTaskCount})</span>
              </h3>

              <FloatingMenu
                columns={columns[activeBoard]}
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
          </div>

          <div className="board-content">
            <BoardSection
              id={activeBoard}
              columns={columns[activeBoard] || []}
              tasks={orderedTasks}
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onTaskClick={handleTaskClick}
              onDragStart={handleDragStart}
              onAddTask={handleAddTask}
              onAddColumn={handleAddColumn}
              removeColumn={removeColumn}
              activeBoard={activeBoard}
              isActive
            />
          </div>
        </div>
      </div>
    </div>
  );
}
