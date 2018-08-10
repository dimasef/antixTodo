"use strict";

let btnNewTask = document.getElementById("show-addNewTask-form");
let addNewTask = document.getElementById("add-new-task");

let tasks = [];

if(localStorage.getItem("antixTasks") !== null) {
    tasks = JSON.parse(localStorage.getItem("antixTasks"));
    let lastTask = tasks[Object.keys(tasks)[Object.keys(tasks).length - 1]];
    document.getElementById("addNewTask-form").dataset.id = lastTask.id;
}

let getCarrentDate = () => {

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if(dd < 10) dd = '0' + dd;

    if(mm < 10) mm = '0' + mm;

    today = dd + '.' + mm + '.' + yyyy;

    return today;

}; 

let validateNewTastk = () => {
    let newTaskTest = document.getElementById("task-text").value,
        newTaskTime = document.getElementById("task-time").value,
        newTaskTimeUit = document.getElementById("task-time-unit").value;
    if (newTaskTest.length != 0 && newTaskTime.length != 0)
        return true;
    else return false;
};

btnNewTask.onclick = () => {
    let addNewTaskForm = document.getElementById("addNewTask-form");
    addNewTaskForm.classList.toggle("none");
};

addNewTask.onclick = () => {
    if(validateNewTastk()){
        let addNewTaskForm = document.getElementById("addNewTask-form");
        tasks.push('task' + addNewTaskForm.dataset.id, {
            id: addNewTaskForm.dataset.id,
            date: getCarrentDate(),
            text: document.getElementById("task-text").value,
            time: document.getElementById("task-time").value,
            doneStatus: false
        });
        addNewTask.dataset.id = ++addNewTaskForm.dataset.id;
        localStorage.setItem('antixTasks', JSON.stringify(tasks));
    } else {
        document.getElementById("addNewTask-form").classList.toggle("none");
    }
};
