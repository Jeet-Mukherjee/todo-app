// Manages task persistence using browser localStorage

import { tasks, setTasks, currentFilter, setCurrentFilter, lastTaskDeleted, setLastTaskDeleted } from "./state.js";

export function loadTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
        setTasks(JSON.parse(stored));
    }
}

export function saveTasks() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Failed to save tasks:", error);
    }
}

export function saveFilter() {
    localStorage.setItem("currentFilter", currentFilter);
}

export function loadFilter() {
    const stored = localStorage.getItem("currentFilter");
    if (stored) {
        setCurrentFilter(stored);
    }
}

// does not work properly
export function saveLastDeleted() {
    localStorage.setItem("lastDelTask", JSON.stringify(lastTaskDeleted));
}

export function loadLastDeleted() {
    const stored = localStorage.getItem("lastDelTask");
    if (stored) {
        setLastTaskDeleted(JSON.parse(stored));
    }
}