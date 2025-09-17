let cachedTasks = [];

export async function loadTasks() {
    try {
        const response = await fetch(`${process.env.PUBLIC_URL || ''}/assets/tarefas.txt`);
        if (!response.ok) return [];
        const text = await response.text();
        const tasks = parseTasks(text);
        cachedTasks = tasks;
        return tasks;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function parseTasks(text) {
    const tasks = [];
    const regex = /Tarefa\s+(\d+):\s*(.*?)\r?\n- Status:\s*(.*?)\r?\nDescrição:\s*([\s\S]*?)(?=\r?\nTarefa\s+\d+:|$)/g;
    let match;
    let counter = 0;

    while ((match = regex.exec(text)) !== null) {
        counter++;
        const status = match[3].trim();
        tasks.push({
            id: `${counter}`,
            title: match[2].trim(),
            status, // status canônico do TXT
            description: match[4].trim(),
        });
    }
    return tasks;
}

export function getCachedTasks() {
    return cachedTasks;
}
