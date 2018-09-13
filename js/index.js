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


    let manageWeekDay = weekDayBlock => {
        const weekDayBtn = Array.from(weekDayBlock.querySelectorAll(".day-item"));
        console.log(weekDayBtn);
        const weekdayAllBtn = weekDayBlock.querySelector(".weekday-all"),
              weekdayEvenBtn = weekDayBlock.querySelector(".weekday-even"),
              weekdayRundomBtn = weekDayBlock.querySelector(".weekday-rundom");

        weekDayBtn.map(item => {
            item.onclick = function() {
                this.classList.toggle("opted");
            }
        });

        weekdayAllBtn.addEventListener("click", function() {
            let mode = this.dataset.mode;
            if(mode === '1') {
                weekDayBtn.map(item => {
                    item.classList.remove("opted");
                });
                this.dataset.mode = '2';
                this.textContent = 'Выбрать все';
            } else {
                weekDayBtn.map(item => {
                    item.classList.add("opted");
                });
                this.dataset.mode = '1';
                this.textContent = 'Убрать все';
            }
        });
    };

    btnNewTask.addEventListener("click", () => {
        const addNewTaskForm = document.getElementById("addNewTask-form");
        const eternityCheckBox = document.getElementById("eternity");
        addNewTaskForm.classList.toggle("none");

        eternityCheckBox.addEventListener("change", function() {
            const weekDayBlock = document.getElementById("weekday");
            if(this.checked) {
                weekDayBlock.classList.toggle("none");
                manageWeekDay(weekDayBlock);
            } 
            else weekDayBlock.classList.toggle("none");
        });
    });
    

    let addNewTaskForm = document.getElementById("addNewTask-form");
    addNewTask.addEventListener("click", () => {
        event.preventDefault();
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