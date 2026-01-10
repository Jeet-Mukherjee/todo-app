import { loadFilter, loadTasks } from "./storage.js";
import { renderTasks } from "./render.js";
import { addTaskEvent, countFilteredTasksHandler, deleteCompletedTasksEvent, delLastTaskEvent, delTaskByIdEvent, editTitleEvent, editCurrentFilterEvent, toggleCheckboxEvent } from "./events.js";

loadTasks();
loadFilter();
renderTasks();
addTaskEvent();
toggleCheckboxEvent();
delLastTaskEvent();
delTaskByIdEvent();
editTitleEvent();
editCurrentFilterEvent();
deleteCompletedTasksEvent();