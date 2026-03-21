// Manages application state
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

export function setSearchQuery(newSearchQuery) {
    searchQuery = newSearchQuery;
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

export function setLastTaskDeleted(deletedTaskData) {
    lastTaskDeleted = deletedTaskData;
}

export function moveTaskUp(taskId) {
    // create a pending-only "view" of tasks (filter returns a new array, not connected to tasks)
    const pendingTasks = tasks.filter(t => t.completed === false);

    // find where our task sits within the pending-only view
    const pendingIndex = pendingTasks.findIndex(t => t.id === taskId);

    // if it's already first in pending, there's nowhere to move up — stop here
    if (pendingIndex <= 0) return;

    // grab the pending task that's sitting directly above our task
    const taskToSwap = pendingTasks[pendingIndex - 1];

    // find the REAL position of our task in the main tasks array (completed tasks may be mixed in)
    const index1 = tasks.findIndex(t => t.id === taskId);
    // find the REAL position of the task we want to swap with in the main tasks array
    const index2 = tasks.findIndex(t => t.id === taskToSwap.id);

    // swap the two tasks in the main array using ES6 destructuring (no temp variable needed)
    // we swap here because pendingTasks is just a copy — changes there wouldn't persist
    [tasks[index1], tasks[index2]] = [tasks[index2], tasks[index1]];
}

export function moveTaskDown(taskId) {
    // create a pending-only "view" of tasks (filter returns a new array, not connected to tasks)
    const pendingTasks = tasks.filter(t => t.completed === false);

    // find where our task sits within the pending-only view
    const pendingIndex = pendingTasks.findIndex(t => t.id === taskId);

    // if it's already last in pending, there's nowhere to move down — stop here
    if (pendingIndex >= pendingTasks.length - 1) return;

    // grab the pending task that's sitting directly below our task
    const taskToSwap = pendingTasks[pendingIndex + 1];

    // find the REAL position of our task in the main tasks array (completed tasks may be mixed in)
    const index1 = tasks.findIndex(t => t.id === taskId);
    // find the REAL position of the task we want to swap with in the main tasks array
    const index2 = tasks.findIndex(t => t.id === taskToSwap.id);

    // swap the two tasks in the main array using ES6 destructuring (no temp variable needed)
    // we swap here because pendingTasks is just a copy — changes there wouldn't persist
    [tasks[index1], tasks[index2]] = [tasks[index2], tasks[index1]];
}