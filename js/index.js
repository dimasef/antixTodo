"use strict";

import Task         from './modules/task';
import TaskHistory  from './modules/history';
import TaskCommnets  from './modules/commnets';
import Validation   from './modules/validation';
import { today, insertAfter }    from './modules/helpers';

if (window.openDatabase) {

    const btnNewTask = document.getElementById("show-addNewTask-form");
    const addNewTask = document.getElementById("add-new-task");
    const weekDayBlock = document.getElementById("weekday");
    const commentModal = document.getElementById("antix-modal-for-comments");
    
    let task = new Task();
    task.renderTaslList();

    let history = new TaskHistory();
    history.showHistoryTask();

    let comment = new TaskCommnets();

    document.addEventListener('DOMContentLoaded', function() {
        let instance = M.Modal.init(commentModal, {
            onOpenEnd: () => {
                let taskId = commentModal.querySelector(".task-comment").dataset.taskid;
            },
        });
    });
    
    let manageWeekDay = weekDayBlock => {
        let result = '';
        const weekDayBtn = Array.from(weekDayBlock.querySelectorAll(".day-item"));

        const weekdayAllBtn = weekDayBlock.querySelector(".weekday-all"),
              weekdayEvenBtn = weekDayBlock.querySelector(".weekday-even"),
              weekdayRundomBtn = weekDayBlock.querySelector(".weekday-rundom");

        weekDayBtn.map(item => {
            item.onclick = function() {
                this.classList.toggle("opted");
            }
        });

        weekdayAllBtn.onclick = function() {
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
        };

        weekdayEvenBtn.onclick = function() {
            let mode = this.dataset.mode;
            if(mode === '1') {
                weekDayBtn.map((item, index) => {
                    if((index % 2) == 0)
                        item.classList.remove("opted");
                    else item.classList.add("opted");
                });
                this.dataset.mode = '2';
                this.textContent = 'Нечетные';
            } else {
                weekDayBtn.map((item, index) => {
                    if((index % 2) == 0)
                        item.classList.add("opted");
                    else item.classList.remove("opted");
                });
                this.dataset.mode = '1';
                this.textContent = 'Четные';
            }
        };

        weekdayRundomBtn.addEventListener("click", () => {
            let rundom = 0;
            weekDayBtn.map(item => {
                rundom = Math.floor(Math.random() * 2);
                if(rundom) item.classList.remove("opted");
                else item.classList.add("opted");
            });
        });
    };

    btnNewTask.addEventListener("click", () => {
        const addNewTaskForm = document.getElementById("addNewTask-form");
        const eternityCheckBox = document.getElementById("eternity");
        addNewTaskForm.classList.toggle("none");

        eternityCheckBox.onchange = function() {
            if(this.checked) {
                weekDayBlock.classList.toggle("none");
                manageWeekDay(weekDayBlock);
            } 
            else weekDayBlock.classList.toggle("none");
        }
    });
    

    let addNewTaskForm = document.getElementById("addNewTask-form");
    addNewTask.addEventListener("click", () => {
        event.preventDefault();
        let validFormTask = new Validation(addNewTaskForm);
        
        if (validFormTask.validate) {
            let existenceDays = '';
            let eternity = +document.getElementById("eternity").checked,
                  time = document.getElementById("task-time").value,
                  text = document.getElementById("task-text").value,
                  btnT = document.getElementById("task-time-unit");

            time = (btnT.options[btnT.selectedIndex].value === '1') ? time : time * 60;

            const weekDayItem = Array.from(weekDayBlock.querySelectorAll(".day-item"));

            if(eternity) {
                weekDayItem.map(item => {
                    existenceDays += item.classList.contains('opted') ? item.dataset.dayid : '';
                });
            } else existenceDays = today('dayId');

            let taskOption = {
                date: today(),
                text,
                time,
                eternity,
                existenceDays
            };
            console.log(taskOption);

            task.add(taskOption);
            addNewTaskForm.classList.toggle("none");
        } 
    });

    let addCommentBtn = commentModal.querySelector(".save-comment");
    addCommentBtn.addEventListener("click", () => {
        let text = commentModal.querySelector(".task-comment").value;
        let taskId = commentModal.querySelector(".task-comment").dataset.taskid;
        let commentObj = {
            date: today(),
            text,
            taskId
        }
        comment.init(commentObj);
    });

} else alert('Скачай хром друг!');