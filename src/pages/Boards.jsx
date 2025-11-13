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
    <div className="content-block">
      <div id="general-content" className="content">
        {/* Botão voltar + tema */}
        <div className="btn-container back-button">
          <button onClick={() => navigate("/")} className="board-icon btn-back">
            <FaArrowCircleLeft size={30} />
          </button>
          <div className="container-options">
            <ThemeToggle />
            <button className="btn btn-thematic new-board">Novo board</button>
          </div>
        </div>

        {/* Introdução */}
        <div className="first-section-board">
          <div className="text-content-intro">
            <div className="titles-content">
              <h2 className="title-thematic h2-board-page">Board de desenvolvimento</h2>
              <h3 className="h3-board-page">Escolha seu board de visualização.</h3>
            </div>
            <BoardControls activeView={activeView} setActiveView={setActiveView} />
          </div>
          <div className="img-block img-panel">
            <img src={svgBoard} alt="Ilustração de board" />
          </div>
        </div>

        {/* Seção principal */}
        <div className="second-section-board">
          <div className="header-board-section">
            <div className="board-title-container">
              <h3 id="h3-title" className="title-thematic">
                {activeView === "kanban" ? "Kanban" : "Scrum"}
                <span className="task-counter">({orderedTasks.length})</span>
              </h3>

              <FloatingMenu
                onAddTask={handleAddTask}
                onAddColumn={() => handleAddColumn(columns[activeView].length)}
              />
            </div>

            <SiCcleaner size={30} className="board-cleaner" onClick={handleClearBoard} />
          </div>

          <div className="tables-block">
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
