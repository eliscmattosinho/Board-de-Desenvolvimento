import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";

import ThemeToggle from "../components/ThemeToggle/ThemeToggle";

import BoardSection from "../components/Board/BoardSection";
import CardTask from "../components/Card/CardTask";
import BoardControls from "../components/Board/BoardControls";
import FloatingMenu from "../components/FloatingMenu/FloatingMenu";
import ColumnCreate from "../components/Column/ColumnModal/ColumnCreate";
import ColumnEdit from "../components/Column/ColumnModal/ColumnEdit";

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

  // Modal de criar/editar coluna
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [columnModalIndex, setColumnModalIndex] = useState(0);
  const [columnModalView, setColumnModalView] = useState("kanban");
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

  const openColumnModal = (view, index, column = null) => {
    setColumnModalView(view);
    setColumnModalIndex(index);
    setEditingColumn(column); // null = criar, objeto = editar
    setColumnModalOpen(true);
  };

  const handleSaveColumn = (columnData) => {
    if (editingColumn) {
      renameColumn(columnModalView, editingColumn.id, columnData);
    } else {
      addColumn(columnModalView, columnModalIndex, columnData);
    }
    setColumnModalOpen(false);
  };

  return (
    <div className="content-block">
      <div id="general-content" className="content">
        <div className="btn-container back-button">
          <button onClick={() => navigate("/")} className="board-icon back-btn">
            <FaArrowCircleLeft />
          </button>
          <div className="container-options">
            < ThemeToggle />

            <button className="btn btn-thematic new-board">Novo board</button>
          </div>
        </div>

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

        <div className="second-section-board">
          <div className="board-title-container">
            <h3 id="h3-title" className="title-thematic">
              {activeView === "kanban" ? "Kanban" : "Scrum"}
              <span className="task-counter">({tasks.length})</span>
            </h3>

            <FloatingMenu
              onAddTask={handleAddTask}
              onAddColumn={() => openColumnModal(activeView, columns[activeView].length)}
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
              onAddColumn={(index, column) => openColumnModal("kanban", index, column)}
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
              onAddColumn={(index, column) => openColumnModal("scrum", index, column)}
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
      {editingColumn ? (
        <ColumnEdit
          isOpen={columnModalOpen}
          onClose={() => setColumnModalOpen(false)}
          onSave={handleSaveColumn}
          columnData={editingColumn}
        />
      ) : (
        <ColumnCreate
          isOpen={columnModalOpen}
          onClose={() => setColumnModalOpen(false)}
          onSave={handleSaveColumn}
        />
      )}
    </div>
  );
}

export default Boards;
