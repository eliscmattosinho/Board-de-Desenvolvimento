// Setagem de visualização dos boards
let draggedTask = null;

export function setupBoards() {
    const kanbanButton = document.getElementById("b-kanban");
    const scrumButton = document.getElementById("b-scrum");
    const kanbanBoard = document.getElementById("kanban");
    const scrumBoard = document.getElementById("scrum");
    const titleElement = document.getElementById("h3-title");

    // Kanban por padrão
    setActiveBoard(kanbanBoard, kanbanButton, "Kanban");

    kanbanButton.addEventListener("click", () => setActiveBoard(kanbanBoard, kanbanButton, "Kanban"));
    scrumButton.addEventListener("click", () => setActiveBoard(scrumBoard, scrumButton, "Scrum"));

    document.querySelectorAll(".col-items").forEach(column => {
        column.addEventListener("dragover", allowDrop);
        column.addEventListener("drop", handleDrop);
    });

    document.querySelectorAll(".task").forEach(task => {
        task.setAttribute("draggable", true);
        task.addEventListener("dragstart", handleDragStart);
    });

    function setActiveBoard(activeBoard, activeButton, boardName) {
        const inactiveBoard = activeBoard === kanbanBoard ? scrumBoard : kanbanBoard;
        const inactiveButton = activeButton === kanbanButton ? scrumButton : kanbanButton;

        activeBoard.classList.add("active");
        activeButton.classList.add("active");

        inactiveBoard.classList.remove("active");
        inactiveButton.classList.remove("active");

        updateBoardTitle(boardName);
    }

    // Função para atualizar o título sem afetar o contador de tarefas
    function updateBoardTitle(boardName) {
        const counterSpan = titleElement.querySelector('.task-counter');
        titleElement.textContent = `${boardName}`;

        if (counterSpan) {
            titleElement.appendChild(counterSpan);
        }
    }
}

function handleDragStart(event) {
    draggedTask = event.target.closest(".task");

    if (!draggedTask) {
        console.error("Erro: Item arrastado não é válido.");
        return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedTask.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();

    if (!draggedTask || !(draggedTask instanceof Node)) {
        console.error("Erro: Nenhuma tarefa foi arrastada ou a tarefa não é um Node válido.");
        return;
    }

    let dropTarget = event.target;

    while (dropTarget && !dropTarget.classList.contains("col-items") && !dropTarget.classList.contains("task")) {
        dropTarget = dropTarget.parentElement;
    }

    if (!dropTarget) {
        console.error("Erro: Nenhum alvo válido para o drop.");
        return;
    }

    const column = dropTarget.classList.contains("col-items") ? dropTarget : dropTarget.parentElement;

    if (!column || !(draggedTask instanceof Node)) {
        console.error("Erro: draggedTask não é um Node válido", draggedTask);
        return;
    }

    if (dropTarget.classList.contains("task")) {
        column.insertBefore(draggedTask, dropTarget);
    } else {
        column.appendChild(draggedTask);
    }

    draggedTask = null;
}
