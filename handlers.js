import { addTask, tasks, currentFilter, searchQuery, setSearchQuery } from "./state.js";
import { saveTasks } from "./storage.js";
import { renderTasks } from "./render.js";

let msgTimeoutId = null;

export function addTaskHandler(inputElement) {
    const userTitle = inputElement.value.trim().replace(/\s+/g, ' ');
    inputElement.value = "";
    if (!userTitle) return;
    duplicateTaskMsg(userTitle);
    addTask(userTitle);
    saveTasks();
    renderTasks();
}

export function filterTasksByStatus(filter) {
    if (filter === "all") return tasks;
    if (filter === "completed") return tasks.filter(t => t.completed);
    if (filter === "pending") return tasks.filter(t => !t.completed);
}

export function searchTasks(taskList, query) {
    if (!query || !query.trim()) return taskList;
    return taskList.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
}

export function getVisibleTasks() { // render.js 7:
    const filtered = filterTasksByStatus(currentFilter);
    const searched = searchTasks(filtered, searchQuery);
    return searched;
}

export function countFilteredTasksHandler() {
    const taskList = filterTasksByStatus(currentFilter);
    const tasksCountEl = document.querySelector("p#tasksCount");
    const filterName = currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);
    tasksCountEl.textContent = `${filterName} tasks: ${taskList.length} / ${tasks.length}`;
}

export const countClearTasksMsg = (() => {
    let msgTimeoutId = null; // private variable

    return function (count) {
        clearTimeout(msgTimeoutId); // uses the timeout id from closure
        const msgElement = document.querySelector("p#msgElement");
        msgElement.textContent = count + " Tasks Cleared";
        msgElement.classList.remove("hidden");
        msgTimeoutId = setTimeout(() => {
            msgElement.textContent = ""; // Non-breaking space
            msgElement.classList.add("hidden");
        }, 500);
    };
})();

export const emptyStateMsg = (() => {
    let msgTimeoutId = null;

    return function () {
        clearTimeout(msgTimeoutId);

        const msgElement = document.querySelector("p#msgElement");
        msgElement.textContent = "No Tasks available";
        msgElement.classList.remove("hidden");
        msgTimeoutId = setTimeout(() => {
            msgElement.textContent = "";
            msgElement.classList.add("hidden");

        }, 500);
    };
})();

export function duplicateTaskMsg(taskTitle) {
    const isDuplicate = tasks.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());
    if (isDuplicate) {
        clearTimeout(msgTimeoutId);
        const msgElement = document.querySelector("p#msgElement");
        msgElement.textContent = "Duplicate task added";
        msgElement.classList.remove("hidden");
        msgTimeoutId = setTimeout(() => {
            msgElement.textContent = "";
            msgElement.classList.add("hidden");
        }, 600);
    }
}

export function updateSearchCount() {
    const filteredCountEl = document.querySelector("p#filteredCount");
    if (!filteredCountEl) return;

    if (searchQuery !== "" && searchQuery.trim() !== "") {
        const searchedTaskList = searchTasks(searchQuery);
        filteredCountEl.classList.remove("hidden");
        filteredCountEl.textContent = `${searchedTaskList.length} tasks match "${searchQuery}"`;
    } else {
        filteredCountEl.classList.add("hidden");
    }
}

export const showStorageError = (() => {
    let errorTimeoutId = null;

    return function (errorType = "save") {
        clearTimeout(errorTimeoutId);

        const errorElement = document.querySelector("p#errorMsg");

        let message = "";
        if (errorType === "save") {
            message = "⚠️ Failed to save. Storage may be full or disabled.";
        } else if (errorType === "load") {
            message = "⚠️ Failed to load saved data. Using defaults.";
        } else if (errorType === "quota") {
            message = "⚠️ Storage full! Consider clearing completed tasks.";
        }

        errorElement.textContent = message;
        errorElement.classList.remove("hidden");
        errorElement.classList.add("shake");

        // Remove shake class after animation
        setTimeout(() => {
            errorElement.classList.remove("shake");
        }, 300);

        // Auto-hide after 5 seconds
        errorTimeoutId = setTimeout(() => {
            errorElement.textContent = "";
            errorElement.classList.add("hidden");
        }, 5000);
    };
})();

export function updateFilterButtons() {
    const filterButtons = document.querySelectorAll("div.filters button");

    filterButtons.forEach(button => {
        const buttonFilter = button.dataset.filter;

        if (buttonFilter === currentFilter) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}