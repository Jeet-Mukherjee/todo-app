// Manages task persistence using browser localStorage

import { showStorageError } from "./handlers.js";
import { tasks, setTasks, currentFilter, setCurrentFilter, lastTaskDeleted, setLastTaskDeleted } from "./state.js";

export function loadTasks() {
    try {
        const stored = localStorage.getItem("tasks");
        if (stored) {
            setTasks(JSON.parse(stored));
        }
    } catch (error) {
        console.error("Failed to Load tasks: ", error);
        showStorageError("load");
    }

}

export function saveTasks() {
    try {
        const serialized = JSON.stringify(tasks);
        localStorage.setItem("tasks", serialized);
    } catch (error) {
        console.error("Failed to save tasks:", error);
        showStorageError("save");
        if (error.name === "QuotaExceededError") {
            showStorageError("quota");
        } else {
            showStorageError("save");
        }
    }
}

export function saveFilter() {
    try {
        localStorage.setItem("currentFilter", currentFilter);
    } catch (error) {
        console.error("Failed to save filter:", error);
    }
}

export function loadFilter() {
    try {
        const stored = localStorage.getItem("currentFilter");
        if (stored) {
            setCurrentFilter(stored);
        }
    } catch (error) {
        console.error("Failed to load filter:", error);
    }

}

export function saveLastDeleted() {
    try {
        localStorage.setItem("lastDelTask", JSON.stringify(lastTaskDeleted));

    } catch (error) {
        console.error("Failed to save last deleted:", error);
    }
}

export function loadLastDeleted() {
    try {
        const stored = localStorage.getItem("lastDelTask");
        if (stored) {
            setLastTaskDeleted(JSON.parse(stored));
        }
    } catch (error) {
        console.error("Failed to load last deleted:", error);
    }

}