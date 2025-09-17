let cachedTasks = [];

export async function loadTasks() {
    try {
        const response = await fetch(`${process.env.PUBLIC_URL || ''}/assets/tarefas.txt`);
        if (!response.ok) {
            console.error("Falha ao carregar o arquivo de tarefas.");
            return [];
        }
        const text = await response.text();
        const tasks = parseTasks(text);
        cachedTasks = tasks;
        return tasks;
    } catch (error) {
        console.error("Erro ao carregar o arquivo de tarefas:", error);
        return [];
    }
}

function parseTasks(text) {
    const tasks = [];
    const taskRegex =
        /Tarefa\s+(\d+):\s*(.*?)\r?\n- Status:\s*(.*?)\r?\nDescrição:\s*([\s\S]*?)(?=\r?\nTarefa\s+\d+:|$)/g;
    let match;
    let counter = 0;

    while ((match = taskRegex.exec(text)) !== null) {
        counter++;
        tasks.push({
            id: `${counter}`,
            title: match[2].trim(),
            status: match[3].trim(),
            description: match[4].trim(),
        });
    }
    return tasks;
}

export function getCachedTasks() {
    return cachedTasks;
}
