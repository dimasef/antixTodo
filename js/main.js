"use strict";

let btnNewTask = document.getElementById("show-addNewTask-form");
let addNewTask = document.getElementById("add-new-task");
let taskList = document.getElementById("task-list");

let tasks = {};

if(window.openDatabase) {
    let db = openDatabase("antiXToDodb","","db", 2097152);
    
    db.transaction((tx) => {
   
        tx.executeSql('CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY , date, text, time, doneStatus);');

        tx.executeSql('SELECT * FROM task;',[], (sqlTransaction, sqlResultSet) => {
    
            tasks = sqlResultSet.rows;
            if(tasks.length) {
                let lastTask = tasks[Object.keys(tasks)[Object.keys(tasks).length - 1]];
                document.getElementById("addNewTask-form").dataset.id = lastTask.id++;
                showTakList(tasks);
            }
            let taskStatusInputs = document.querySelectorAll(".task-status");
            taskStatusInputs.forEach((value) => {
                value.onchange = () => {
                    let chengedID = value.id;
                    for (let i = 0; i < tasks.length; i++) { 
                        if (tasks.item(i).id == chengedID) {
                            db.transaction((tx) => {
                                tx.executeSql('UPDATE task SET doneStatus=? WHERE id=?', [+value.checked, tasks.item(i).id]);
                            }); 
                        }
                    }
                }
            });
        });
        
    //tx.executeSql('DROP TABLE task');
    });

    //функция вывода тасков 
    function showTakList (takListObj) {
        let value;
        taskList.innerHTML = '';
        for (let i = 0; i < takListObj.length; i++) {
            value = takListObj.item(i);
            taskList.innerHTML += `<div class="task-block" data-id="${value.id}">
                <div class="task-status-block">
                    <input id="${value.id}" type="checkbox" class="task-status" ${value.doneStatus ? 'checked' : ''}>
                </div>
                <div class="task-text">${value.text}</div>
                <span>Время которое необходимо затратить: ${value.time}</span>
            </div>`;
        }
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
        if(validateNewTastk()) {
            let addNewTaskForm = document.getElementById("addNewTask-form");
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO task (id, date, text, time, doneStatus) VALUES(?,?,?,?,?);', [addNewTaskForm.dataset.id, 
                getCarrentDate(), document.getElementById("task-text").value, document.getElementById("task-time").value, 0]);
                addNewTask.dataset.id = addNewTaskForm.dataset.id++;
                
                tx.executeSql('SELECT * FROM task;',[], (sqlTransaction, sqlResultSet) => {
                    showTakList(sqlResultSet.rows);
                });
                
            });
        } else {
            document.getElementById("addNewTask-form").classList.toggle("none");
        }
    };

} else alert('Ваш браузер НЕ підтримує openDatabase.');