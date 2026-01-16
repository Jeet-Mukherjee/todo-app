// Manages application state (tasks[], editingTaskId, currentFilter)
export let tasks = [];
export let editingTaskId = null;
export let currentFilter = "all";
export let searchQuery = "";
export let lastTaskDeleted = null; // attention

// Setter functions allow other modules to update state variables
// Direct reassignment (tasks = [...]) only works within this module
export function setTasks(newTasks) {
    tasks = newTasks;
}

export function setCurrentFilter(newCurrentFilter) {
    currentFilter = newCurrentFilter;
}

export function setEditingTaskId(taskId) {
    editingTaskId = taskId;
}

export function setSearchQuery(taskTitle) {
    searchQuery = taskTitle;
}

// Mutating task[] is allowed in other modules, but using
// functions keeps state management centralized and cleaner

// creates and adds a new task to the tasks array
export function addTask(title) {
    tasks.push({
        id: Date.now(), // unique id based on timestamp
        title, // ES6 shorthand for title: title
        completed: false,
    })
}

export function setLastTaskDeleted(deletedTask) {
    lastTaskDeleted = deletedTask;
}

export function moveTaskUp(taskId) {
    const pendingTasks = tasks.filter(t => t.completed === false);

    const pendingIndex = pendingTasks.findIndex(t => t.id === taskId);

    if (pendingIndex <= 0) return;

    const taskToSwap = pendingTasks[pendingIndex - 1];

    const index1 = tasks.findIndex(t => t.id === taskId);
    const index2 = tasks.findIndex(t => t.id === taskToSwap.id);

    [tasks[index1], tasks[index2]] = [tasks[index2], tasks[index1]];
}

export function moveTaskDown(taskId) {
    const pendingTasks = tasks.filter(t => t.completed === false);

    const pendingIndex = pendingTasks.findIndex(t => t.id === taskId);

    if (pendingIndex >= pendingTasks.length - 1) return;

    const taskToSwap = pendingTasks[pendingIndex + 1];

    const index1 = tasks.findIndex(t => t.id === taskId);
    const index2 = tasks.findIndex(t => t.id === taskToSwap.id);

    [tasks[index1], tasks[index2]] = [tasks[index2], tasks[index1]];
}