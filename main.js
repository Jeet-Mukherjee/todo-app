import { loadFilter, loadTasks } from "./storage.js";
import { renderTasks } from "./render.js";
import { addTaskEvent, deleteCompletedTasksEvent, delLastTaskEvent, delTaskByIdEvent, editTitleEvent, editCurrentFilterEvent, toggleCheckboxEvent, deleteAllTasksEvent, FilterBySearchEvent } from "./events.js";

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
deleteAllTasksEvent();
FilterBySearchEvent();