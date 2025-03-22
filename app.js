const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'tasks.json');

function readTasks() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tasks', error);
        return [];
    }
}

function writeTasks(tasks) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing tasks', error);
    }
}

function generateId(tasks) {
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(task => task.id)) + 1;
}

function addTask(description) {
    const tasks = readTasks();
    const newTask = {
        id: generateId(tasks),
        description: description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    writeTasks(tasks);
    console.log('Task added:', newTask);
}

function updateTask(id, updates) {
    const tasks = readTasks();
    const taskId = parseInt(id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        console.log('Task not found:', taskId);
        return;
    }
    const task = tasks[taskIndex];
    if (updates.description) {
        task.description = updates.description;
    }
    if (updates.status) {
        if (!['todo', 'in progress', 'done'].includes(updates.status)) {
            console.log(`Invalid status: ${updates.status}, Use todo, in progress, or done.`);
            return;
        }
        task.status = updates.status;
    }
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log('Task updated:', task);
}

function deleteTask(id) {
    const tasks = readTasks();
    const taskId = parseInt(id);
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    if (filteredTasks.length === initialLength) {
        console.log('Task not found:', taskId);
        return;
    }
    writeTasks(filteredTasks);
    console.log('Task deleted:', taskId);
}

function markTask(id, status) {
    const tasks = readTasks();
    const taskId = parseInt(id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        console.log('Task not found:', taskId);
        return;
    }
    const validStatuses = ['todo', 'in progress', 'done'];
    if (!validStatuses.includes(status)){
        console.error(`Invalid status: ${status}, Use todo, in progress, or done.`);
        return;
    }
    const task = tasks[taskIndex];
    task.status = status;
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log('Task marked as', status, ':', task);
}

function listTasks(filter = 'all') {
    const tasks = readTasks();
    let filteredTasks = [];
    switch (filter) {
        case 'all':
            filteredTasks = tasks;
            break;
        case 'done':
            filteredTasks = tasks.filter(task => task.status === 'done');
            break;
        case 'not-done':
            filteredTasks = tasks.filter(task => task.status !== 'done');
            break;
        case 'in-progress':
            filteredTasks = tasks.filter(task => task.status === 'in progress');
            break;
        case 'todo':
            filteredTasks = tasks.filter(task => task.status === 'todo');
            break;
        default:
            console.error('Invalid filter. Use: all, done, not done, in progress, todo');
            return;
    }
    if (filteredTasks.length === 0) {
        console.log('No tasks found');
        return;
    }
    console.log(`Tasks (${filter}):`);
    filteredTasks.forEach(task => {
        console.log(`#${task.id} [${task.status}] ${task.description}`);
        console.log(`   Created: ${task.createdAt}, Updated: ${task.updatedAt}`);
    });
}

function main() {
    const action = process.argv[2];
    if (!action) {
        console.log('Usage: node app.js <action> [options]');
        console.log('Actions: add, update, delete, mark, list');
        return;
    }

    switch (action) {
        case 'add':
            const description = process.argv[3];
            if (!description) {
                console.error('Error: Missing task description');
                return;
            }
            addTask(description);
            break;
        case 'update':
            const updateId = process.argv[3];
            if (!updateId) {
                console.error('Error: Missing task ID');
                return;
            }
            const updates = {};
            for (let i = 4; i < process.argv.length; i++) {
                const [key, value] = process.argv[i].split('=');
                if (key && value) {
                    updates[key] = value;
                }
            }
            if (Object.keys(updates).length === 0) {
                console.error('Error: No updates provided (e.g., description="New desc" status=done)');
                return;
            }
            updateTask(updateId, updates);
            break;
        case 'delete':
            const deleteId = process.argv[3];
            if (!deleteId) {
                console.error('Error: Missing task ID');
                return;
            }
            deleteTask(deleteId);
            break;
        case 'mark':
            const markId = process.argv[3];
            const status = process.argv[4];
            if (!markId || !status) {
                console.error('Error: Usage: mark <taskId> <status>');
                return;
            }
            markTask(markId, status);
            break;
        case 'list':
            const filter = process.argv[3] || 'all';
            listTasks(filter);
            break;
        default:
            console.error(`Error: Unknown action '${action}'`);
    }
}

main();