import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupBoards } from "../js/boardsManipulation";
import { loadTasks } from "../js/tasksLoader";
import BoardSection from "../components/BoardSection";
import { FaArrowCircleLeft } from "react-icons/fa";

import "../App.css";
import "./Boards.css";
import svgBoard from "../assets/images/svg-board.svg";

function Boards() {
    const navigate = useNavigate();

    useEffect(() => {
        setupBoards();
        loadTasks();
    }, []);

    const allowDrop = (event) => event.preventDefault();
    const handleDrop = (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text");
        const taskElement = document.getElementById(data);
        event.target.appendChild(taskElement);
    };

    const kanbanColumns = [
        { id: "to-do", title: "A Fazer", className: "kanban-column todo" },
        { id: "k-in-progress", title: "Em Progresso", className: "kanban-column progress" },
        { id: "k-done", title: "Concluído", className: "kanban-column done" }
    ];

    const scrumColumns = [
        { id: "backlog", title: "Backlog", className: "scrum-column backlog" },
        { id: "sprint-backlog", title: "Sprint Backlog", className: "scrum-column todo" },
        { id: "s-in-progress", title: "Em Progresso", className: "scrum-column progress" },
        { id: "review", title: "Revisão", className: "scrum-column review" },
        { id: "s-done", title: "Concluído", className: "scrum-column done" }
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
                        <div className="btns-block">
                            <button id="b-kanban" className="btn btn-kanban">
                                <p className="btn-title">Kanban</p>
                            </button>
                            <button id="b-scrum" className="btn btn-scrum">
                                <p className="btn-title">Scrum</p>
                            </button>
                        </div>
                    </div>
                    <div className="img-block">
                        <img src={svgBoard} alt="" />
                    </div>
                </div>

                <div className="second-section-board">
                    <h3 id="h3-title">ExampleVar</h3>
                    <div className="tables-block">
                        <BoardSection id="kanban" columns={kanbanColumns} onDrop={handleDrop} onDragOver={allowDrop} />
                        <BoardSection id="scrum" columns={scrumColumns} onDrop={handleDrop} onDragOver={allowDrop} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Boards;
