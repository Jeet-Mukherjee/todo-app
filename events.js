import { tasks, addTask, removeLastTask, setTasks, editingTaskId, setEditingTaskId, setCurrentFilter, currentFilter } from "./state.js";
import { saveFilter, saveTasks } from "./storage.js";
import { renderTasks } from "./render.js";

export function addTaskHandler(inputElement) {
    const userTitle = inputElement.value.trim().replace(/\s+/g, ' ');
    if (!userTitle) return;
    duplicateTaskMsg(userTitle);
    addTask(userTitle);
    saveTasks();
    renderTasks();
    inputElement.value = "";
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

export function toggleCheckboxEvent() {

    // event delegation for toggle checkbox of tasks
    const elTaskListContainer = document.getElementById("taskList")

    elTaskListContainer.addEventListener("change", (e) => {
        if (e.target.type !== "checkbox") return;

        const li = e.target.closest("li");
        if (!li) return;

        const taskId = Number(li.dataset.id);
        const selectedTask = tasks.find(t => t.id === taskId);
        if (!selectedTask) return;

        selectedTask.completed = e.target.checked;

        saveTasks();
        renderTasks();
    });
}

export function addTaskEvent() {

    const addTaskInputElement = document.querySelector("input#taskInput");
    if (!addTaskInputElement) return;
    addTaskInputElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTaskHandler(addTaskInputElement);
        }
    });
    // event listner for add button 
    const addTaskButton = document.getElementById("addBtn");
    if (!addTaskButton) return;
    addTaskButton.addEventListener('click', () => {
        addTaskHandler(addTaskInputElement);
    });
}

export function delLastTaskEvent() {
    const delLastTaskBtn = document.querySelector("button#lastTaskBtn");
    if (!delLastTaskBtn) {
        return;
    };
    delLastTaskBtn.addEventListener("click", () => {
        const taskList = filterTasksHandler(currentFilter);
        if (taskList.length === 0) return;
        // removeLastTask(taskList);
        const lastTask = taskList[taskList.length - 1];
        const newTasks = tasks.filter(t => t.id !== lastTask.id);
        setTasks(newTasks);
        saveTasks();
        renderTasks();
    });

}

export function delTaskByIdEvent() {
    const elTaskListContainer = document.querySelector("ul#taskList");
    let isDeleting = false;

    elTaskListContainer.addEventListener("click", (e) => {
        const clickedBtn = e.target.closest("button");
        if (!clickedBtn) return;

        if (isDeleting) return;
        isDeleting = true;

        const taskId = Number(clickedBtn.dataset.id);
        const selectedTask = tasks.find(t => t.id === taskId);

        if (!selectedTask) return;

        const newTasks = tasks.filter(t => t.id !== selectedTask.id);

        setTasks(newTasks);
        saveTasks();
        renderTasks();

        setTimeout(() => {
            isDeleting = false;
        }, 500);

    });
}

export function deleteCompletedTasksEvent() {
    const clearCTaskBtn = document.querySelector("button#clearCTaskBtn");
    if (!clearCTaskBtn) return;
    clearCTaskBtn.addEventListener('click', (e) => {
        const comletedTasksCount = tasks.filter(t => t.completed === true).length;
        if (comletedTasksCount === 0) return;
        clearTaskMsg(comletedTasksCount);
        const filteredTasks = tasks.filter(t => t.completed === false);
        setTasks(filteredTasks);
        saveTasks();
        renderTasks();
    });
}

export function editTitleEvent() {

    const elTaskListContainer = document.querySelector("ul#taskList");

    elTaskListContainer.addEventListener("click", (e) => {
        const taskTitleElement = e.target.closest("span");
        const taskContainer = e.target.closest("li");
        if (!taskTitleElement || !taskContainer) return;

        setEditingTaskId(Number(taskContainer.dataset.id));

        renderTasks();
        const targetContainer = document.querySelector(`li[data-id="${editingTaskId}"]`);
        if (!targetContainer) return;

        const taskInputElement = targetContainer.querySelector('input[type="text"]');
        if (!taskInputElement) return;

        taskInputElement.focus();

        taskInputElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                let taskToEdit = tasks.find(t => t.id === editingTaskId);
                let oldTitle = taskToEdit.title;
                let newTitle = taskInputElement.value.trim()
                if (!newTitle || (oldTitle === newTitle)) { // new addition
                    e.preventDefault();
                    return;
                }
                duplicateTaskMsg(newTitle);
                taskToEdit.title = newTitle;
                setEditingTaskId(null);
                saveTasks();
                renderTasks();
            }
        });

        taskInputElement.addEventListener("blur", () => {
            if (editingTaskId === null) return;
            setEditingTaskId(null);
            renderTasks();
        })
    })
};

export function editCurrentFilterEvent() {
    const filterContainer = document.querySelector("div.filters");
    if (!filterContainer) return;
    filterContainer.addEventListener("click", (e) => {
        const clickedButtonElement = e.target.closest("button");
        if (!clickedButtonElement) return;
        const selectedFilter = clickedButtonElement.dataset.filter;
        setCurrentFilter(selectedFilter);
        saveFilter(currentFilter);
        saveTasks();
        renderTasks();
    })
}



export const clearTaskMsg = (() => {
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

export function handleButtonStates() {
    const isEditing = editingTaskId !== null;
    const clrCTaskBtn = document.querySelector("button#clearCTaskBtn");
    const delLastTaskBtn = document.querySelector("button#lastTaskBtn");
    clrCTaskBtn.disabled = isEditing;
    delLastTaskBtn.disabled = isEditing;
}