"use strict";

import { db, Task }  from './modules/task';
import { getCarrentDate, TaskHistory }  from './modules/history';
import Validation  from './modules/validation';

if(window.openDatabase) {

    const btnNewTask = document.getElementById("show-addNewTask-form");
    const addNewTask = document.getElementById("add-new-task");
    
    let task = new Task(getCarrentDate());
    task.renderTaslList();

    let history = new TaskHistory();
    history.showHistoryTask();

    // db.transaction((tx) => {
    //     tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity);');
    //     tx.executeSql('CREATE TABLE IF NOT EXISTS TaskHistory (date STRING PRIMARY KEY, id_arr_done STRING, id_arr_fail STRING, progress STRING);');
    //     //tx.executeSql('DROP TABLE TaskHistory;');

    // });

    btnNewTask.onclick = () => {
        const addNewTaskForm = document.getElementById("addNewTask-form");
        addNewTaskForm.classList.toggle("none");
    };

    let addNewTaskForm = document.getElementById("addNewTask-form");
    
    addNewTask.onclick = event => {
        event.preventDefault();
        let validFormTask = new Validation(addNewTaskForm);
        
        if(validFormTask.makeValidation()) {
            let taskTime = document.getElementById("task-time").value;
            const btnT = document.getElementById("task-time-unit"),
                  eternityTask = document.getElementById("eternity").checked,
                  taskText = document.getElementById("task-text").value;

            taskTime = (btnT.options[btnT.selectedIndex].value === '1') ? taskTime : taskTime * 60;

            let taskOption = {
                date: getCarrentDate(),
                text: taskText,
                time: taskTime,
                eternity: +eternityTask
            };

            task.add(taskOption);
        } else {
            //document.getElementById("addNewTask-form").classList.toggle("none");
        }
    };

} else alert('Ваш браузер НЕ підтримує openDatabase.');