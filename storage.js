// Manages task persistence using browser localStorage

import { tasks, setTasks, currentFilter, setCurrentFilter } from "./state.js";

export function loadTasks() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
        setTasks(JSON.parse(stored));
    }
}

export function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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