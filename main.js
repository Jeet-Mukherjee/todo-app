import { loadFilter, loadLastDeleted, loadTasks } from "./storage.js";
import { renderTasks } from "./render.js";
import { addTaskEvent, deleteCompletedTasksEvent, delLastTaskEvent, delTaskByIdEvent, editTitleEvent, editCurrentFilterEvent, toggleCheckboxEvent, deleteAllTasksEvent, FilterBySearchEvent, undoLastDelEvent, moveTaskEvent } from "./events.js";

loadTasks();
loadFilter();
loadLastDeleted();
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
undoLastDelEvent();
moveTaskEvent();