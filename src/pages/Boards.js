import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardSection from "../components/BoardSection";
import CardTask from "../components/CardTask";
import BoardControls from "../components/BoardControls";
import { FaArrowCircleLeft } from "react-icons/fa";

import useTasks from "../hooks/useTasks";
import { columnIdToCanonicalStatus } from "../js/boardUtils";

import "../App.css";
import "./Boards.css";
import svgBoard from "../assets/images/svg-board.svg";

function Boards() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("kanban");
  const [selectedTask, setSelectedTask] = useState(null);

  const [tasks, , moveTask] = useTasks();

  const allowDrop = (e) => e.preventDefault();
  const handleDragStart = (e, taskId) => e.dataTransfer.setData("text/plain", taskId);
  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;
    const canonicalStatus = columnIdToCanonicalStatus(columnId);
    moveTask(taskId, canonicalStatus);
  };

  const kanbanColumns = [
    { id: "to-do", title: "A Fazer", className: "kanban-column todo" },
    { id: "k-in-progress", title: "Em Progresso", className: "kanban-column progress" },
    { id: "k-done", title: "Concluído", className: "kanban-column done" },
  ];

  const scrumColumns = [
    { id: "backlog", title: "Backlog", className: "scrum-column backlog" },
    { id: "sprint-backlog", title: "Sprint Backlog", className: "scrum-column todo" },
    { id: "s-in-progress", title: "Em Progresso", className: "scrum-column progress" },
    { id: "review", title: "Revisão", className: "scrum-column review" },
    { id: "s-done", title: "Concluído", className: "scrum-column done" },
  ];

  return (
    <div className="content-block">
      <div id="general-content" className="content">
        <div className="back-button">
          <button onClick={() => navigate("/")} className="back-btn">
            <FaArrowCircleLeft />
          </button>
        </div>

        <div className="first-section-board">
          <div className="text-content-intro">
            <div className="titles-content">
              <h2 className="h2-board-page">Board de desenvolvimento</h2>
              <h3 className="h3-board-page">Escolha sua opção de visualização.</h3>
            </div>
            <BoardControls activeView={activeView} setActiveView={setActiveView} />
          </div>
          <div className="img-block">
            <img src={svgBoard} alt="" />
          </div>
        </div>

        <div className="second-section-board">
          <h3 id="h3-title">
            {activeView === "kanban" ? "Kanban" : "Scrum"}
            <span className="task-counter">({tasks.length})</span>
          </h3>
          <div className="tables-block">
            <BoardSection
              id="kanban"
              columns={kanbanColumns}
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onTaskClick={setSelectedTask}
              onDragStart={handleDragStart}
              tasks={tasks}
              activeView="kanban"
              isActive={activeView === "kanban"}
            />
            <BoardSection
              id="scrum"
              columns={scrumColumns}
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onTaskClick={setSelectedTask}
              onDragStart={handleDragStart}
              tasks={tasks}
              activeView="scrum"
              isActive={activeView === "scrum"}
            />
          </div>
        </div>
      </div>

      <CardTask task={selectedTask} onClose={() => setSelectedTask(null)} activeView={activeView} />
    </div>
  );
}

export default Boards;
