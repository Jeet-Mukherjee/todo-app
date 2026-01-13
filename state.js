// Manages application state (tasks[], editingTaskId, currentFilter)
export let tasks = [];
export let editingTaskId = null;
export let currentFilter = "all";
export let searchQuery = "";

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
