import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { SiCcleaner } from "react-icons/si";

import ThemeToggle from "@components/ThemeToggle/ThemeToggle";
import BoardSection from "@board/components/BoardSection";
import BoardControls from "@board/components/BoardControls";
import FloatingMenu from "@components/FloatingMenu/FloatingMenu";

import useBoard from "@board/hooks/useBoard";
import kanbanTemplate from "@board/components/templates/kanbanTemplate";
import scrumTemplate from "@board/components/templates/scrumTemplate";

import svgBoard from "@assets/images/svg-board.svg";

import "./Boards.css";

function Boards() {
  // @TODO extrair board -> BoardContext e deixar só a área de hub para data

  const navigate = useNavigate();

  const {
    activeView,
    setActiveView,
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
  } = useBoard(kanbanTemplate, scrumTemplate);

  return (
    <div id="hub-container">
      <div className="hub-content">
        {/* Ações no Hub */}
        <div className="hub-actions">
          <button onClick={() => navigate("/")} className="board-icon btn-back">
            <FaArrowCircleLeft size={30} />
          </button>

          <div className="hub-sub-actions">
            <ThemeToggle />
            <button id="new-board" className="btn btn-thematic">
              Novo board
            </button>
          </div>
        </div>

        {/* Hub header */}
        <div className="hub-header">
          <div className="hub-introduction">
            <div className="hub-infos">
              <h2 className="hub-title title-thematic">
                Hub de desenvolvimento
              </h2>
              <p className="sub-title">Escolha seu board de visualização.</p>
            </div>

            <BoardControls
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>

          <div className="img-container hub-img-container">
            <img
              src={svgBoard}
              alt="Illustration of a dashboard interface with floating UI elements, including charts, checklists, and notification cards in green and blue tones on a dark background"
            />
          </div>
        </div>

        {/* Hub board */}
        <div className="hub-active-board">
          <div className="board-header">
            <div className="board-title-container">
              <h3 id="board-title" className="title-thematic">
                {activeView === "kanban" ? "Kanban" : "Scrum"}
                <span className="task-counter">({orderedTasks.length})</span>
              </h3>

              <FloatingMenu
                onAddTask={handleAddTask}
                onAddColumn={() => handleAddColumn(columns[activeView].length)}
              />
            </div>

            <button id="board-cleaner" className="board-icon clean-icon"
              onClick={handleClearBoard}
              data-tooltip="Limpar tarefas"
            >
              <SiCcleaner
                size={30}
              />
            </button>
          </div>

          <div className="board-content">
            {activeView === "kanban" && (
              <BoardSection
                id="kanban"
                columns={columns.kanban}
                tasks={orderedTasks}
                onDrop={handleDrop}
                onDragOver={allowDrop}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onAddTask={handleAddTask}
                onAddColumn={handleAddColumn}
                removeColumn={removeColumn}
                activeView="kanban"
                isActive
              />
            )}

            {activeView === "scrum" && (
              <BoardSection
                id="scrum"
                columns={columns.scrum}
                tasks={orderedTasks}
                onDrop={handleDrop}
                onDragOver={allowDrop}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onAddTask={handleAddTask}
                onAddColumn={handleAddColumn}
                removeColumn={removeColumn}
                activeView="scrum"
                isActive
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Boards;
