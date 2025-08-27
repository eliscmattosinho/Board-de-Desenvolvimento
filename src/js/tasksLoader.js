let cachedTasks = [];

// Carrega tarefas do arquivo txt
export async function loadTasks() {
    try {
        const response = await fetch(`${process.env.PUBLIC_URL || ''}/assets/tarefas.txt`);

        if (!response.ok) {
            console.error("Falha ao carregar o arquivo de tarefas.");
            return;
        }

        const text = await response.text();
        const tasks = parseTasks(text);
        cachedTasks = tasks;

        if (!tasks.length) {
            console.warn("Nenhuma tarefa encontrada no arquivo.");
            return;
        }

        createTaskItems(tasks);
        updateColumnTaskCount();
        updateTotalTaskCount();
        observeBoardChanges();

        console.info(`✅ ${tasks.length} tarefas carregadas com sucesso.`);
    } catch (error) {
        console.error('Erro ao carregar o arquivo de tarefas:', error);
    }
}

// Parseia o arquivo de texto
function parseTasks(text) {
    const tasks = [];
    const taskRegex = /Tarefa\s+(\d+):\s*(.*?)\r?\n- Status:\s*(.*?)\r?\nDescrição:\s*([\s\S]*?)(?=\r?\nTarefa\s+\d+:|$)/g;
    let match;
    let counter = 0;

    while ((match = taskRegex.exec(text)) !== null) {
        counter++;
        const id = `task-${counter}`;
        const title = match[2].trim();
        const status = match[3].trim();
        const description = match[4].trim();

        tasks.push({ id, title, status, description });
    }

    return tasks;
}

// Recarrega tarefas ao trocar de board
export function reloadTasksOnBoardChange() {
    if (cachedTasks.length) {
        createTaskItems(cachedTasks);
        updateColumnTaskCount();
        updateTotalTaskCount();
    } else {
        console.warn("Nenhuma tarefa carregada ainda.");
    }
}

// Observa mudanças de classe nos boards para recarregar as tarefas
function observeBoardChanges() {
    const boards = document.querySelectorAll('.board');

    boards.forEach(board => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class' && board.classList.contains('active')) {
                    reloadTasksOnBoardChange();
                }
            });
        });

        observer.observe(board, { attributes: true, attributeFilter: ['class'] });
    });
}

// Função que mapeia o status das tarefas para a view ativa
function mapTaskStatusToView(task, platform) {
    const statusMap = {
        kanban: {
            "Backlog": "A Fazer",
            "Sprint Backlog": "A Fazer",
            "Revisão": "Em Progresso",
            "A Fazer": "A Fazer",
            "Em Progresso": "Em Progresso",
            "Concluído": "Concluído"
        },
        scrum: {
            "A Fazer": "Backlog",
            "Backlog": "Backlog",
            "Sprint Backlog": "Sprint Backlog",
            "Fazendo": "Em Progresso",
            "Em Progresso": "Em Progresso",
            "Revisão": "Revisão",
            "Concluído": "Concluído"
        }
    };

    const mappedStatus = statusMap[platform][task.status] || task.status;
    return { ...task, status: mappedStatus };
}

// Cria os elementos das tasks e adiciona nas colunas corretas
function createTaskItems(tasks) {
    const board = document.querySelector('.board.active');
    if (!board) {
        console.error("Nenhum board ativo encontrado.");
        return;
    }

    const mappings = {
        kanban: {
            'A Fazer': 'to-do',
            'Em Progresso': 'k-in-progress',
            'Concluído': 'k-done'
        },
        scrum: {
            'Backlog': 'backlog',
            'Sprint Backlog': 'sprint-backlog',
            'Em Progresso': 's-in-progress',
            'Revisão': 'review',
            'Concluído': 's-done'
        }
    };

    // Detecta se o board ativo é kanban ou scrum
    const platform = board.classList.contains("kanban-board") ? "kanban" : "scrum";
    const mapping = mappings[platform];

    // Limpa colunas
    board.querySelectorAll('.col-items').forEach(col => col.innerHTML = '');

    tasks.forEach((task) => {
        // Ajusta o status conforme a view ativa
        const adjustedTask = mapTaskStatusToView(task, platform);

        const columnId = mapping[adjustedTask.status];
        if (!columnId) {
            console.warn(`Status não mapeado: ${adjustedTask.status}`);
            return;
        }

        const column = document.getElementById(columnId);
        if (column) {
            column.querySelector('.col-items').appendChild(createTaskElement(adjustedTask));
        } else {
            console.error(`Coluna ${columnId} (${platform}) não encontrada para o status: ${adjustedTask.status}`);
        }
    });
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('item', 'task-item');
    taskElement.setAttribute('draggable', 'true');
    taskElement.setAttribute('data-task-id', task.id);
    taskElement.addEventListener('dragstart', drag);

    const taskTitle = document.createElement('h3');
    taskTitle.classList.add('item-title');
    taskTitle.textContent = task.title;

    const taskDescription = document.createElement('p');
    taskDescription.classList.add('item-description');
    taskDescription.textContent = task.description || "Sem descrição.";

    taskElement.appendChild(taskTitle);
    taskElement.appendChild(taskDescription);

    taskElement.onclick = () => openTaskModal(task);

    return taskElement;
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.getAttribute("data-task-id"));
}

function updateColumnTaskCount() {
    document.querySelectorAll('.col-board').forEach(column => {
        const titleElement = column.querySelector('.col-title-board');
        const itemsContainer = column.querySelector('.col-items');

        if (titleElement && itemsContainer) {
            const taskCount = itemsContainer.children.length;

            let counterSpan = titleElement.querySelector('.task-counter');
            if (!counterSpan) {
                counterSpan = document.createElement('span');
                counterSpan.classList.add('task-counter');
                titleElement.appendChild(counterSpan);
            }
            counterSpan.textContent = `(${taskCount})`;
        }
    });
}

function updateTotalTaskCount() {
    let totalTaskCount = 0;
    const activeBoard = document.querySelector('.board.active');

    if (activeBoard) {
        activeBoard.querySelectorAll('.col-items').forEach(col => {
            totalTaskCount += col.children.length;
        });

        const h3Title = document.getElementById('h3-title');
        if (h3Title) {
            let counterSpan = h3Title.querySelector('.task-counter');
            if (!counterSpan) {
                counterSpan = document.createElement('span');
                counterSpan.classList.add('task-counter');
                h3Title.appendChild(counterSpan);
            }
            counterSpan.textContent = `(${totalTaskCount})`;
        }
    }
}

// Modal único de task
function openTaskModal(task) {
    let modal = document.querySelector('.modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const title = document.createElement('h2');
    title.textContent = task.title;
    modalContent.appendChild(title);

    const infoContent = document.createElement('div');
    infoContent.classList.add('info-content');

    const status = document.createElement('p');
    status.innerHTML = `<strong>Status:</strong> ${task.status}`;
    infoContent.appendChild(status);

    const description = document.createElement('p');
    description.innerHTML = `<strong>Descrição:</strong> ${task.description || 'Nenhuma descrição disponível.'}`;
    infoContent.appendChild(description);

    modalContent.appendChild(infoContent);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.classList.add('modal-close');
    closeButton.onclick = () => modal.remove();

    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}
