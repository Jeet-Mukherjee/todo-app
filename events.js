import { tasks, addTask, setTasks, editingTaskId, setEditingTaskId, setCurrentFilter, currentFilter, setSearchQuery, lastTaskDeleted, setLastTaskDeleted, moveTaskUp, moveTaskDown } from "./state.js";
import { saveFilter, saveLastDeleted, saveTasks } from "./storage.js";
import { renderTasks } from "./render.js";
import { countClearTasksMsg, addTaskHandler, duplicateTaskMsg, filterTasksHandler, emptyStateMsg } from "./handlers.js";

export function addTaskEvent() {

    const addTaskInputElement = document.querySelector("input#taskInput");
    if (!addTaskInputElement) return;
    addTaskInputElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTaskHandler(addTaskInputElement);
        }
        if (e.key === "Escape") {
            addTaskInputElement.value = "";
            return;
        }
    });
    addTaskInputElement.addEventListener("blur", () => {
        addTaskInputElement.value = ""
    })
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

        // Define handlers as named functions so we can remove them
        const handleKeydown = (e) => {
            const taskToEdit = tasks.find(t => t.id === editingTaskId);
            if (!taskToEdit) return;

            if (e.key === "Enter") {
                const newTitle = taskInputElement.value.trim().replace(/\s+/g, ' ');
                const oldTitle = taskToEdit.title;

                if (!newTitle || (oldTitle === newTitle)) {
                    e.preventDefault();
                    return;
                }

                duplicateTaskMsg(newTitle);
                taskToEdit.title = newTitle;
                setEditingTaskId(null);
                saveTasks();
                renderTasks();
            }
            else if (e.key === "Escape") {
                setEditingTaskId(null);
                renderTasks();
            }
        };

        const handleBlur = () => {
            if (editingTaskId === null) return;
            setEditingTaskId(null);
            renderTasks();
        };

        // Add listeners
        taskInputElement.addEventListener("keydown", handleKeydown);
        taskInputElement.addEventListener("blur", handleBlur);
    });
}

export function toggleCheckboxEvent() {

    // event delegation for toggle checkbox of tasks
    const elTaskListContainer = document.getElementById("taskList");

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



export function delLastTaskEvent() {
    const delLastTaskBtn = document.querySelector("button#lastTaskBtn");
    if (!delLastTaskBtn) {
        return;
    };
    delLastTaskBtn.addEventListener("click", () => {
        const taskList = filterTasksHandler(currentFilter);
        if (taskList.length === 0) {
            emptyStateMsg();
            return;
        }
        // removeLastTask(taskList);
        const lastTask = taskList[taskList.length - 1];
        setLastTaskDeleted(lastTask);
        const newTasks = tasks.filter(t => t.id !== lastTask.id);
        setTasks(newTasks);
        saveTasks();
        saveLastDeleted();
        renderTasks();
    });

}

export function delTaskByIdEvent() {
    const elTaskListContainer = document.querySelector("ul#taskList");
    // let isDeleting = false;

    elTaskListContainer.addEventListener("click", (e) => {
        const clickedBtn = e.target.closest("button");
        if (!clickedBtn) return;

        // only handle delete action    
        if (clickedBtn.dataset.action !== "delete") return;

        const taskId = Number(clickedBtn.dataset.id);
        const selectedTask = tasks.find(t => t.id === taskId);

        if (!selectedTask) {
            return;
        }
        setLastTaskDeleted(selectedTask);

        const newTasks = tasks.filter(t => t.id !== selectedTask.id);

        setTasks(newTasks);
        saveTasks();
        saveLastDeleted();
        renderTasks();
    });
}

export function deleteCompletedTasksEvent() {
    const clearCTaskBtn = document.querySelector("button#clearCTaskBtn");
    if (!clearCTaskBtn) return;
    clearCTaskBtn.addEventListener('click', () => {
        const comletedTasksCount = tasks.filter(t => t.completed === true).length;
        if (isNaN(comletedTasksCount)) return;
        if (comletedTasksCount === 0) {
            emptyStateMsg();
        } else {
            countClearTasksMsg(comletedTasksCount);
        }
        const filteredTasks = tasks.filter(t => t.completed === false);
        setTasks(filteredTasks);
        saveTasks();
        renderTasks();
    });
}

export function deleteAllTasksEvent() {
    const clearAllTasksBtn = document.querySelector("#clearAllTasksBtn");
    if (!clearAllTasksBtn) {
        return;
    }
    clearAllTasksBtn.addEventListener("click", () => {
        let tasksCount = tasks.length;
        if (tasksCount === 0) {
            emptyStateMsg();
        } else {
            countClearTasksMsg(tasksCount);
        }
        setTasks([]);
        saveTasks();
        renderTasks();
    });
}


export function editCurrentFilterEvent() {
    const filterContainer = document.querySelector("div.filters");
    if (!filterContainer) return;
    filterContainer.addEventListener("click", (e) => {
        const clickedButtonEl = e.target.closest("button");
        if (!clickedButtonEl) return;
        const selectedFilter = clickedButtonEl.dataset.filter;
        setCurrentFilter(selectedFilter);
        saveFilter(currentFilter);
        saveTasks();
        renderTasks();
    })
}


export function FilterBySearchEvent() {
    const taskSearchEl = document.querySelector("input#taskSearch");
    if (!taskSearchEl) return;

    taskSearchEl.addEventListener("input", (e) => {
        const searchValue = e.target.value;
        setSearchQuery(searchValue);
        renderTasks();
    });

    taskSearchEl.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            taskSearchEl.value = "";
            setSearchQuery("");
            renderTasks();
            taskSearchEl.blur(); // Optional: removes focus from the input
        }
    });

    taskSearchEl.addEventListener("blur", () => {
        taskSearchEl.value = "";
        setSearchQuery("");
        renderTasks();
    })
}

export function undoLastDelEvent() {
    const undoLastDel = document.querySelector("button#undoLastDel");
    if (!undoLastDel) return;

    undoLastDel.addEventListener("click", () => {
        if (!lastTaskDeleted) {
            emptyStateMsg();
            return;
        } else {
            tasks.push(lastTaskDeleted);
            setLastTaskDeleted(null);
            saveTasks();
            saveLastDeleted();
            renderTasks();
        }
    });
}

export function moveTaskEvent() {
    const taskListContainer = document.querySelector("ul#taskList");
    if (!taskListContainer) return;

    taskListContainer.addEventListener("click", (e) => {
        const clickedBtn = e.target.closest("button");
        if (!clickedBtn) return;

        const action = clickedBtn.dataset.action;
        if (action !== "up" && action !== "down") return;

        const taskId = Number(clickedBtn.dataset.id);

        if (action == "up") {
            moveTaskUp(taskId);
        } else if (action === "down") {
            moveTaskDown(taskId);
        }

        saveTasks();
        renderTasks();
    });
}