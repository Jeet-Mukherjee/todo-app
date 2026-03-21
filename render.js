// Manages rendering tasks to the DOM
import { updateTaskCount, getVisibleTasks, updateFilterButtons, updateSearchCount } from "./handlers.js";
import { currentFilter, editingTaskId, searchQuery } from "./state.js";

// Renders filtered tasks to the DOM based on current filter and editing state
export function renderTasks() {
    // get tasklist 
    const taskList = getVisibleTasks();

    // tasklist heading
    const taskListEl = document.querySelector("ul#taskList");
    let taskListTitle = currentFilter + " tasks";
    taskListEl.innerText = taskListTitle.toUpperCase();

    // hint about reordering
    if (currentFilter !== "pending" && taskList.length > 0) {
        const hint = document.createElement("p");
        hint.classList.add("notify");
        hint.textContent = "Switch to 'Pending' to reorder tasks";
        taskListEl.appendChild(hint);
    }

    // notification msg => tasklist is empty
    let noTaskMsg = "no tasks yet";
    if (taskList.length === 0) {
        const filteredCount = document.querySelector("p#filteredCount");
        filteredCount.classList.add("hidden");
        const taskMsgEl = document.createElement("p");
        taskMsgEl.classList.add("notify");
        if (searchQuery !== "") {
            noTaskMsg = `no tasks match "${searchQuery}"`;
        } else {
            if (currentFilter !== "all") {
                noTaskMsg = `no ${currentFilter} tasks yet`;
            }
        }
        taskMsgEl.textContent = noTaskMsg;

        taskListEl.appendChild(taskMsgEl);
        updateButtonStates();
        updateFilterButtons();
        updateTaskCount();
        return;
    }

    taskList.forEach((task) => {
        // create all elements
        const li = document.createElement("li");
        const checkbox = document.createElement("input");

        // configure elements
        li.dataset.id = task.id;
        // Apply completed styling to finished tasks
        li.classList.toggle("completed", task.completed);

        // If task is being edited, show input field instead of span// Store task ID in data attribute for event handling
        // data-id attribute allows us to identify which task was clicked
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        // append checkbox first
        li.appendChild(checkbox);

        // handle editing state (creates input OR span)
        if (task.id === editingTaskId) {
            li.classList.add("editing");
            checkbox.disabled = true;

            // Add editing icon
            const iconSpan = document.createElement("span");
            iconSpan.textContent = "✏️"; // Pencil emoji
            iconSpan.classList.add("edit-icon");
            li.appendChild(iconSpan);

            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 30;
            input.value = task.title; // Form controls use .value
            li.appendChild(input)

        } else {
            const span = document.createElement("span");
            span.classList.add("taskDisplay");
            span.textContent = task.title;
            li.appendChild(span);

        }

        // button container for up/down button
        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("task-buttons");
        if (task.id === editingTaskId || currentFilter !== "pending" || searchQuery !== "") {
            buttonGroup.classList.add('hidden');
        }

        const upBtn = document.createElement("button");
        upBtn.dataset.id = task.id;
        upBtn.dataset.action = "up";
        upBtn.textContent = "↑";
        upBtn.classList.add("move-btn");
        buttonGroup.appendChild(upBtn);

        const downBtn = document.createElement("button");
        downBtn.dataset.id = task.id;
        downBtn.dataset.action = "down";
        downBtn.textContent = "↓";
        downBtn.classList.add("move-btn");
        buttonGroup.appendChild(downBtn);

        li.appendChild(buttonGroup);

        // create and configure the delete button
        const delBtn = document.createElement("button");
        delBtn.dataset.id = task.id;
        delBtn.dataset.action = "delete";
        delBtn.textContent = "Delete";
        li.appendChild(delBtn);
        if (task.id === editingTaskId) {
            delBtn.disabled = true;
        }

        // append li to ul#taskList
        taskListEl.appendChild(li);
    });
    updateButtonStates();
    updateFilterButtons();
    updateTaskCount();
    updateSearchCount();
}

export function updateButtonStates() {
    const isEditing = editingTaskId !== null;
    const completedTasks = document.querySelector("button#clearCTaskBtn");
    const lastTasks = document.querySelector("button#lastTaskBtn");
    const allTasks = document.querySelector("button#clearAllTasksBtn");
    const undoLastDel = document.querySelector("button#undoLastDel");
    completedTasks.disabled = isEditing;
    lastTasks.disabled = isEditing;
    allTasks.disabled = isEditing;
    undoLastDel.disabled = isEditing;
}