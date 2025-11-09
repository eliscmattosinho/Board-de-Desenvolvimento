import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { SiCcleaner } from "react-icons/si";

import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import BoardSection from "../components/Board/BoardSection";
import CardModal from "../components/Card/CardModal/CardModal";
import BoardControls from "../components/Board/BoardControls";
import FloatingMenu from "../components/FloatingMenu/FloatingMenu";
import ClearBoardToast from "../components/ToastProvider/toasts/ClearBoardToast";
import ColumnModal from "../components/Column/ColumnModal/ColumnModal";

import { useTasks } from "../context/TasksContext";
import { useModal } from "../context/ModalContext";
import useColumns from "../hooks/useColumns";
import { columnIdToCanonicalStatus } from "../utils/boardUtils";
import { showWarning, showCustom, showSuccess } from "../utils/toastUtils";

import "../App.css";
import "./Boards.css";
import svgBoard from "../assets/images/svg-board.svg";

function Boards() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("kanban");

  const { openModal } = useModal();
  const { tasks, addTask, moveTask, updateTask, deleteTask, clearTasks } = useTasks();

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
    openModal(CardModal, {
      task: { ...newTask, isNew: true },
      activeView,
      columns: columns[activeView],
      moveTask,
      updateTask,
      deleteTask,
    });
  };

  const handleClearBoard = () => {
    if (tasks.length === 0) {
      showWarning("Não há tarefas para remover — o board já está vazio!");
      return;
    }

    showCustom(({ closeToast }) => (
      <ClearBoardToast
        onConfirm={() => {
          clearTasks();
          closeToast();
          showSuccess("Todas as tarefas foram removidas com sucesso!");
        }}
        onCancel={closeToast}
      />
    ));
  };

  return (
    <div className="content-block">
      <div id="general-content" className="content">
        {/* Botão voltar + tema */}
        <div className="btn-container back-button">
          <button onClick={() => navigate("/")} className="board-icon back-btn">
            <FaArrowCircleLeft />
          </button>
          <div className="container-options">
            <ThemeToggle />
            <button className="btn btn-thematic new-board">Novo board</button>
          </div>
        </div>

        {/* Seção introdutória */}
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
                <span className="task-counter">({tasks.length})</span>
              </h3>

              <FloatingMenu
                onAddTask={handleAddTask}
                onAddColumn={() =>
                  openModal(ColumnModal, {
                    mode: "create",
                    onSave: (data) =>
                      addColumn(activeView, columns[activeView].length, data),
                  })
                }
              />
            </div>

            <SiCcleaner size={30} className="board-cleaner" onClick={handleClearBoard} />
          </div>

          {/* Seções Kanban e Scrum */}
          <div className="tables-block">
            <BoardSection
              id="kanban"
              columns={columns.kanban}
              tasks={orderedTasks}
              onDrop={handleDrop}
              onDragOver={allowDrop}
              onTaskClick={(task) =>
                openModal(CardModal, {
                  task,
                  activeView,
                  columns: columns.kanban,
                  moveTask,
                  updateTask,
                  deleteTask,
                })
              }
              onDragStart={handleDragStart}
              onAddTask={handleAddTask}
              onAddColumn={(index, column) =>
                openModal(ColumnModal, {
                  mode: column ? "edit" : "create",
                  columnData: column,
                  onSave: (data) => {
                    if (column) {
                      renameColumn("kanban", column.id, data);
                    } else {
                      addColumn("kanban", index, data);
                    }
                  },
                })
              }
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
              onTaskClick={(task) =>
                openModal(CardModal, {
                  task,
                  activeView,
                  columns: columns.scrum,
                  moveTask,
                  updateTask,
                  deleteTask,
                })
              }
              onDragStart={handleDragStart}
              onAddTask={handleAddTask}
              onAddColumn={(index, column) =>
                openModal(ColumnModal, {
                  mode: column ? "edit" : "create",
                  columnData: column,
                  onSave: (data) => {
                    if (column) {
                      renameColumn("scrum", column.id, data);
                    } else {
                      addColumn("scrum", index, data);
                    }
                  },
                })
              }
              removeColumn={removeColumn}
              activeView="scrum"
              isActive={activeView === "scrum"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Boards;
