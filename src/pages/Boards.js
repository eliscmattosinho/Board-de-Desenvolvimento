import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";

import BoardSection from "../components/Board/BoardSection";
import CardTask from "../components/Card/CardTask";
import BoardControls from "../components/Board/BoardControls";
import FloatingMenu from "../components/FloatingMenu/FloatingMenu";
import ColumnCreate from "../components/Board/Column/ColumnCreate";

import useTasks from "../hooks/useTasks";
import useColumns from "../hooks/useColumns";
import { columnIdToCanonicalStatus } from "../js/boardUtils";

import "../App.css";
import "./Boards.css";
import svgBoard from "../assets/images/svg-board.svg";

function Boards() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("kanban");
  const [selectedTask, setSelectedTask] = useState(null);

  const [tasks, addTask, moveTask, updateTask, deleteTask] = useTasks();

  const defaultKanban = [
    { id: "to-do", title: "A Fazer", className: "kanban-column todo" },
    { id: "k-in-progress", title: "Em Progresso", className: "kanban-column progress" },
    { id: "k-done", title: "Concluído", className: "kanban-column done" },
  ];

  const defaultScrum = [
    { id: "backlog", title: "Backlog", className: "scrum-column backlog" },
    { id: "sprint-backlog", title: "Sprint Backlog", className: "scrum-column todo" },
    { id: "s-in-progress", title: "Em Progresso", className: "scrum-column progress" },
    { id: "review", title: "Revisão", className: "scrum-column review" },
    { id: "s-done", title: "Concluído", className: "scrum-column done" },
  ];

  const [columns, addColumn, renameColumn, removeColumn] = useColumns(defaultKanban, defaultScrum);

  // Estado do modal de criar/editar coluna
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalIndex, setCreateModalIndex] = useState(0);
  const [createModalView, setCreateModalView] = useState("kanban");
  const [editingColumn, setEditingColumn] = useState(null);

  const allowDrop = (e) => e.preventDefault();

  const handleDragStart = (e, taskId) => e.dataTransfer.setData("text/plain", taskId);

  const handleDrop = (e, columnId, targetTaskId = null) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;
    const canonicalStatus = columnIdToCanonicalStatus(columnId);
    moveTask(taskId, canonicalStatus, targetTaskId);
  };

  const orderedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const handleAddTask = (columnId = null) => {
    const newTask = addTask(columnId, activeView);
    setSelectedTask({ ...newTask, isNew: true });
  };

  // Abre modal de criar ou editar coluna
  const openCreateColumnModal = (view, index, column = null) => {
    setCreateModalView(view);
    setCreateModalIndex(typeof index === "number" ? index : columns[view].length);
    setEditingColumn(column || null);
    setCreateModalOpen(true);
  };

  // Salva os dados do modal
  const handleSaveCreateColumn = (columnData) => {
    if (editingColumn) {
      // Edição
      renameColumn(createModalView, editingColumn.id, columnData);
    } else {
      // Criação
      addColumn(createModalView, createModalIndex, columnData);
    }
    setCreateModalOpen(false);
  };

  return (
    <div className="content-block">
      <div id="general-content" className="content">
        <div className="btn-container back-button">
          <button onClick={() => navigate("/")} className="back-btn">
            <FaArrowCircleLeft />
          </button>
          <button className="btn new-board">Novo board</button>
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
            <img src={svgBoard} alt="Ilustração de board" />
          </div>
        </div>

        <div className="second-section-board">
          <div className="board-title-container">
            <h3 id="h3-title">
              {activeView === "kanban" ? "Kanban" : "Scrum"}
              <span className="task-counter">({tasks.length})</span>
            </h3>

            <FloatingMenu
              onAddTask={handleAddTask}
              onAddColumn={() => openCreateColumnModal(activeView, columns[activeView].length)}
            />
          </div>

          <div className="tables-block">
            <BoardSection
              id="kanban"
              columns={columns.kanban}
              tasks={orderedTasks}
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onTaskClick={setSelectedTask}
              onDragStart={handleDragStart}
              onAddTask={handleAddTask}
              onAddColumn={(index, column) => openCreateColumnModal("kanban", index, column)}
              removeColumn={removeColumn}
              activeView="kanban"
              isActive={activeView === "kanban"}
            />

            <BoardSection
              id="scrum"
              columns={columns.scrum}
              tasks={orderedTasks}
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onTaskClick={setSelectedTask}
              onDragStart={handleDragStart}
              onAddTask={handleAddTask}
              onAddColumn={(index, column) => openCreateColumnModal("scrum", index, column)}
              removeColumn={removeColumn}
              activeView="scrum"
              isActive={activeView === "scrum"}
            />
          </div>
        </div>
      </div>

      <CardTask
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        activeView={activeView}
        columns={columns[activeView]}
        moveTask={moveTask}
        updateTask={(taskId, changes) => { updateTask(taskId, changes); setSelectedTask(null); }}
        deleteTask={(taskId) => { deleteTask(taskId); setSelectedTask(null); }}
      />

      {/* Modal de criação/edição de coluna */}
      <ColumnCreate
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleSaveCreateColumn}
        columnData={editingColumn}
      />
    </div>
  );
}

export default Boards;
