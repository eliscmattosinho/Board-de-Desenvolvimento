import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadTasks } from "../js/tasksLoader";
import BoardSection from "../components/BoardSection";
import CardTask from "../components/CardTask";
import { FaArrowCircleLeft } from "react-icons/fa";

import "../App.css";
import "./Boards.css";
import svgBoard from "../assets/images/svg-board.svg";

function Boards() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeView, setActiveView] = useState("kanban"); // 'kanban' or 'scrum'

    // --- canonical status mappings (Scrum are the canonical statuses) ---
    const canonicalToKanban = {
        "Backlog": "A Fazer",
        "Sprint Backlog": "A Fazer",
        "Em Progresso": "Em Progresso",
        "Revisão": "Em Progresso",
        "Concluído": "Concluído",
    };

    const canonicalToScrum = {
        "Backlog": "Backlog",
        "Sprint Backlog": "Sprint Backlog",
        "Em Progresso": "Em Progresso",
        "Revisão": "Revisão",
        "Concluído": "Concluído",
    };

    // used to normalize statuses that might already be in Kanban display form
    const displayToCanonical = {
        "A Fazer": "Backlog",
        "Fazer": "Backlog",
        "Fazendo": "Em Progresso",
        "Feito": "Concluído",
        "A Fazer": "Backlog",
        "Em Progresso": "Em Progresso",
        "Revisão": "Revisão",
        "Concluído": "Concluído",
        "Backlog": "Backlog",
        "Sprint Backlog": "Sprint Backlog",
    };

    useEffect(() => {
        // Carrega e normaliza para status canônicos (Scrum)
        loadTasks().then((loaded = []) => {
            const normalized = loaded.map((t) => ({
                ...t,
                status: displayToCanonical[t.status] || t.status,
            }));
            setTasks(normalized);
        });
    }, []);

    const allowDrop = (event) => event.preventDefault();

    const handleDragStart = (event, taskId) => {
        // guarda o id no dataTransfer para o drop
        try {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", taskId);
            // fallback older code:
            event.dataTransfer.setData("text", taskId);
        } catch (err) {
            console.warn("Problema ao setar dataTransfer:", err);
        }
    };

    // colunaId -> status canônico (Scrum)
    const columnIdToCanonicalStatus = (id) => {
        const map = {
            // Kanban columns
            "to-do": "Backlog",
            "k-in-progress": "Em Progresso",
            "k-done": "Concluído",
            // Scrum columns
            "backlog": "Backlog",
            "sprint-backlog": "Sprint Backlog",
            "s-in-progress": "Em Progresso",
            "review": "Revisão",
            "s-done": "Concluído",
        };
        return map[id] || id;
    };

    const handleDrop = (event, columnId) => {
        event.preventDefault();
        const taskId =
            event.dataTransfer.getData("text/plain") ||
            event.dataTransfer.getData("text");
        if (!taskId) return;

        const canonicalStatus = columnIdToCanonicalStatus(columnId);

        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: canonicalStatus } : t))
        );
    };

    // colunas definidas (os ids aqui são usados pelo columnIdToCanonicalStatus)
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

    const getStatusMapFor = (view) => (view === "kanban" ? canonicalToKanban : canonicalToScrum);

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
                        <div className="btns-block">
                            <button
                                id="b-kanban"
                                className={`btn btn-kanban ${activeView === "kanban" ? "active" : ""}`}
                                onClick={() => setActiveView("kanban")}
                            >
                                <p className="btn-title">Kanban</p>
                            </button>
                            <button
                                id="b-scrum"
                                className={`btn btn-scrum ${activeView === "scrum" ? "active" : ""}`}
                                onClick={() => setActiveView("scrum")}
                            >
                                <p className="btn-title">Scrum</p>
                            </button>
                        </div>
                    </div>
                    <div className="img-block">
                        <img src={svgBoard} alt="" />
                    </div>
                </div>

                <div className="second-section-board">
                    <h3 id="h3-title">
                        {activeView === "kanban" ? "Kanban" : "Scrum"}<span className="task-counter">({tasks.length})</span>
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
                            statusMap={getStatusMapFor("kanban")}
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
                            statusMap={getStatusMapFor("scrum")}
                            isActive={activeView === "scrum"}
                        />
                    </div>
                </div>
            </div>

            <CardTask
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                statusMap={getStatusMapFor(activeView)}
            />
        </div>
    );
}

export default Boards;
