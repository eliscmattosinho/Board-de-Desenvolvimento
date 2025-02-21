export async function loadTasks() {
    try {
        const response = await fetch(`${process.env.PUBLIC_URL || ''}/assets/tarefas.txt`);

        if (!response.ok) {
            console.error("Falha ao carregar o arquivo de tarefas.");
            return;
        }

        const text = await response.text();

        // Processando as tarefas
        const tasks = parseTasks(text);

        createTaskItems(tasks);

        updateColumnTaskCount();
        updateTotalTaskCount();
    } catch (error) {
        console.error('Erro ao carregar o arquivo de tarefas:', error);
    }
}

// Função para parsear o conteúdo do arquivo
function parseTasks(text) {
    const tasks = [];

    const taskRegex = /Tarefa (\d+): (.*?)\n- Status: (.*?)\nDescrição: (.*?)(?=\nTarefa \d+:|$)/gs;
    let match;

    while ((match = taskRegex.exec(text)) !== null) {
        const title = match[2].trim();
        const status = match[3].trim();
        const description = match[4].trim();

        tasks.push({ title, status, description });
    }

    return tasks;
}

function createTaskItems(tasks) {
    const mappings = {
        kanban: {
            'A Fazer': 'to-do',
            'Em Progresso': 'k-in-progress',
            'Concluído': 'k-done',
            'Backlog': 'to-do',
            'Sprint Backlog': 'to-do',
            'Revisão': 'k-in-progress'
        },
        scrum: {
            'A Fazer': 'backlog',
            'Backlog': 'backlog',
            'Sprint Backlog': 'sprint-backlog',
            'Em Progresso': 's-in-progress',
            'Revisão': 'review',
            'Concluído': 's-done'
        }
    };

    // Limpar colunas antes de adicionar novos elementos
    document.querySelectorAll('.col-items').forEach(column => column.innerHTML = '');

    // Função para criar um card único
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('item', 'task-item');
        taskElement.setAttribute('draggable', 'true');
        taskElement.setAttribute('data-task-id', task.title);
        taskElement.addEventListener('dragstart', drag);

        const taskTitle = document.createElement('h3');
        taskTitle.classList.add('item-title');
        taskTitle.textContent = task.title;
        taskElement.appendChild(taskTitle);

        // Adiciona evento de clique para abrir o modal
        taskElement.onclick = () => {
            openTaskModal(task);
        };

        return taskElement;
    }

    tasks.forEach((task) => {
        // Função para adicionar tarefa na coluna de Kaban ou Scrum
        function addTaskToColumn(mapping, platform) {
            const columnId = mapping[task.status];
            if (columnId) {
                const column = document.getElementById(columnId);
                if (column) {
                    column.querySelector('.col-items').appendChild(createTaskElement(task));
                } else {
                    console.error(`Coluna ${platform} não encontrada para o status: ${task.status}`);
                }
            }
        }

        addTaskToColumn(mappings.kanban, 'Kanban');
        addTaskToColumn(mappings.scrum, 'Scrum');
    });
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.getAttribute("data-task-id"));
}

// Atualiza a contagem de tarefas em cada coluna
function updateColumnTaskCount() {
    document.querySelectorAll('.col-board').forEach(column => {
        const titleElement = column.querySelector('.col-title-board');
        const itemsContainer = column.querySelector('.col-items');

        if (titleElement && itemsContainer) {
            const taskCount = itemsContainer.children.length;

            // Verifica se já existe um contador e atualiza
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

// Atualiza a contagem total de tarefas no board ativo
function updateTotalTaskCount() {
    let totalTaskCount = 0;

    // Encontra o board ativo
    const activeBoard = document.querySelector('.board.active');

    if (activeBoard) {
        activeBoard.querySelectorAll('.col-items').forEach(column => {
            totalTaskCount += column.children.length;
        });

        const h3Title = document.getElementById('h3-title');
        if (h3Title) {
            // Vê se já existe um span com o contador e atualiza ou cria um novo
            let counterSpan = h3Title.querySelector('.task-counter');
            if (!counterSpan) {
                counterSpan = document.createElement('span');
                counterSpan.classList.add('task-counter');
                h3Title.appendChild(counterSpan);
            }

            counterSpan.textContent = `(${totalTaskCount})`;
        }
    } else {
        console.error('Board ativo não encontrado.');
    }
}

// Função para abrir o modal com as informações da tarefa
function openTaskModal(task) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Título
    const title = document.createElement('h2');
    title.textContent = task.title;
    modalContent.appendChild(title);

    const infoContent = document.createElement('div');
    infoContent.classList.add('info-content');
    modalContent.appendChild(infoContent);

    // Status
    const status = document.createElement('p');
    const strongStatus = document.createElement('strong');
    strongStatus.textContent = 'Status: ';
    status.appendChild(strongStatus);
    status.appendChild(document.createTextNode(task.status));
    infoContent.appendChild(status);

    // Descrição
    const description = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = 'Descrição: ';
    description.appendChild(strong);
    description.appendChild(document.createTextNode(task.description || 'Nenhuma descrição disponível.'));
    infoContent.appendChild(description);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.classList.add('modal-close');
    closeButton.onclick = () => {
        modal.remove();
    };
    modalContent.appendChild(closeButton);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}