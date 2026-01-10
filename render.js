// Manages rendering tasks to the DOM
import { countFilteredTasksHandler, filterTasksHandler, handleButtonStates, updateFilterButtons } from "./events.js";
import { currentFilter, editingTaskId, tasks } from "./state.js";

// Renders filtered tasks to the DOM based on current filter and editing state
export function renderTasks() {
    // get the current filter
    const taskList = filterTasksHandler(currentFilter);
    const taskListEl = document.getElementById("taskList");
    let taskListTitle = currentFilter + " tasks"
    taskListEl.innerHTML = taskListTitle.toLocaleUpperCase();

    if (taskList.length === 0) {
        const taskMsgEl = document.createElement("p");
        taskMsgEl.classList.add("notify");
        taskMsgEl.textContent = `no ${currentFilter} tasks yet`;
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
            checkbox.disabled = true;
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 30;
            input.value = task.title; // Form controls use .value
            li.appendChild(input)

        } else {
            const span = document.createElement("span");
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