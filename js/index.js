"use strict";

import Task         from './modules/task';
import TaskHistory  from './modules/history';
import Validation   from './modules/validation';
import { today }    from './modules/helpers';

if (window.openDatabase) {

    const btnNewTask = document.getElementById("show-addNewTask-form");
    const addNewTask = document.getElementById("add-new-task");
    
    let task = new Task();
    task.renderTaslList();

    let history = new TaskHistory();
    history.showHistoryTask();

    btnNewTask.addEventListener("click", () => {
        const addNewTaskForm = document.getElementById("addNewTask-form");
        addNewTaskForm.classList.toggle("none");

    });


    const weekDayBlock = document.getElementById("weekday");
    const weekDayBtn = Array.from(weekDayBlock.querySelectorAll(".day-item"));
    
    weekDayBtn.map(item => {
        item.addEventListener("click", e => {
            e.target.classList.toggle("opted");
        });
    });

    let addNewTaskForm = document.getElementById("addNewTask-form");
    addNewTask.addEventListener("click", () => {
        event.preventDefault();
        console.log("sd");
        let validFormTask = new Validation(addNewTaskForm);
        
        if (validFormTask.validate) {

            let eternity = +document.getElementById("eternity").checked,
                  time = document.getElementById("task-time").value,
                  text = document.getElementById("task-text").value,
                  btnT = document.getElementById("task-time-unit");

            time = (btnT.options[btnT.selectedIndex].value === '1') ? time : time * 60;

            let taskOption = {
                date: today(),
                text,
                time,
                eternity
            };
            console.log(taskOption);

            task.add(taskOption);
            addNewTaskForm.classList.toggle("none");
        } 
    });

} else alert('Ваш браузер НЕ підтримує openDatabase.');