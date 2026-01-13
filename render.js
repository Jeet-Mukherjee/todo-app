// Manages rendering tasks to the DOM
import { countFilteredTasksHandler, filterBySearchHandler, filterTasksHandler, updateFilterButtons } from "./handlers.js";
import { currentFilter, editingTaskId, searchQuery } from "./state.js";

// Renders filtered tasks to the DOM based on current filter and editing state
export function renderTasks() {
    // get the current filter
    const taskList = filterBySearchHandler(searchQuery);
    const taskListEl = document.getElementById("taskList");
    let taskListTitle = currentFilter + " tasks";
    taskListEl.innerText = taskListTitle.toLocaleUpperCase();
    let noTaskMsg = "no tasks yet";

    if (taskList.length === 0) {
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
        handleButtonStates(); // need attention
        updateFilterButtons();
        countFilteredTasksHandler();
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

        // create and configure the delete button
        const delBtn = document.createElement("button");
        delBtn.dataset.id = task.id;
        delBtn.textContent = "Delete";
        li.appendChild(delBtn);
        if (task.id === editingTaskId) {
            delBtn.disabled = true;
        }

        // append li to ul#taskList
        taskListEl.appendChild(li);
    });
    handleButtonStates();
    updateFilterButtons();
    countFilteredTasksHandler();
}


export function handleButtonStates() {
    const isEditing = editingTaskId !== null;
    const clrCTaskBtn = document.querySelector("button#clearCTaskBtn");
    const delLastTaskBtn = document.querySelector("button#lastTaskBtn");
    clrCTaskBtn.disabled = isEditing;
    delLastTaskBtn.disabled = isEditing;
}