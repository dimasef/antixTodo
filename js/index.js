"use strict";

import Task         from './modules/task';
import TaskHistory  from './modules/history';
import Validation   from './modules/validation';
import { today }    from './modules/helpers';

if(window.openDatabase) {

    const btnNewTask = document.getElementById("show-addNewTask-form");
    const addNewTask = document.getElementById("add-new-task");
    
    let task = new Task();
    task.renderTaslList();

    let history = new TaskHistory();
    history.showHistoryTask();

    btnNewTask.addEventListener('click', () => {
        const addNewTaskForm = document.getElementById("addNewTask-form");
        addNewTaskForm.classList.toggle("none");
    });

    let addNewTaskForm = document.getElementById("addNewTask-form");
    addNewTask.addEventListener('click', () => {
        event.preventDefault();
        let validFormTask = new Validation(addNewTaskForm);
        
        if(validFormTask.makeValidation()) {
            let taskTime = document.getElementById("task-time").value;
            const btnT = document.getElementById("task-time-unit"),
                  eternityTask = document.getElementById("eternity").checked,
                  taskText = document.getElementById("task-text").value;

            taskTime = (btnT.options[btnT.selectedIndex].value === '1') ? taskTime : taskTime * 60;

            let taskOption = {
                date: today,
                text: taskText,
                time: taskTime,
                eternity: +eternityTask
            };

            task.add(taskOption);
            addNewTaskForm.classList.toggle("none");
        } 
    });


} else alert('Ваш браузер НЕ підтримує openDatabase.');