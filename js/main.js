"use strict";

let btnNewTask = document.getElementById("show-addNewTask-form");

btnNewTask.onclick = () => {

    let addNewTaskForm = document.getElementById("addNewTask-form");
    addNewTaskForm.classList.toggle("none");
};