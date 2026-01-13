import { addTask, tasks, currentFilter, searchQuery, setSearchQuery } from "./state.js";
import { saveTasks } from "./storage.js";
import { renderTasks } from "./render.js";

export function addTaskHandler(inputElement) {
    const userTitle = inputElement.value.trim().replace(/\s+/g, ' ');
    inputElement.value = "";
    if (!userTitle) return;
    duplicateTaskMsg(userTitle);
    addTask(userTitle);
    saveTasks();
    renderTasks();
}

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

export function filterTasksHandler(currentFilter) {
    let filteredTasks;

    if (currentFilter === "all") {
        filteredTasks = tasks;
    }
    else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(t => t.completed === true);
    }
    else if (currentFilter === "pending") {
        filteredTasks = tasks.filter(t => t.completed === false);
    }
    return filteredTasks;
}

export function countFilteredTasksHandler() {
    const taskList = filterTasksHandler(currentFilter);
    const tasksCountEl = document.querySelector("p#tasksCount");
    const filterName = currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);
    tasksCountEl.textContent = `${filterName} tasks: ${taskList.length} / ${tasks.length}`;
}

export function filterBySearchHandler(searchValue) {
    const taskList = filterTasksHandler(currentFilter);
    if (!searchValue || !searchValue.trim()) { return taskList; }
    setSearchQuery(searchValue);
    const searchList = taskList.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return searchList;
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
        }, 3000);
    };
})();

export const emptyStateMsg = (() => {
    let msgTimeoutId = null; // private variable

    return function () {
        clearTimeout(msgTimeoutId); // uses the timeout id from closure

        const msgElement = document.querySelector("p#msgElement");
        msgElement.textContent = "No Tasks available";
        msgElement.classList.remove("hidden");
        msgTimeoutId = setTimeout(() => {
            msgElement.textContent = ""; // Non-breaking space
            msgElement.classList.add("hidden");
        }, 3000);
    };
})();


export const duplicateTaskMsg = (() => {
    let msgTimeoutId = null;

    return function (taskTitle) {
        const isDuplicate = tasks.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());
        if (isDuplicate) {
            clearTimeout(msgTimeoutId);
            const msgElement = document.querySelector("p#msgElement");
            msgElement.textContent = "Duplicate task added";
            msgElement.classList.remove("hidden");
            msgTimeoutId = setTimeout(() => {
                msgElement.textContent = "";
                msgElement.classList.add("hidden");
            }, 3000);
        }
    }

})();


